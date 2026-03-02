using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using AppAI.Core.Models.Documents;
using AppAI.Core.Models.Profile;
using AppAI.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using QuestPDF.Helpers;
using AppAI.Core.Entities;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;


namespace AppAI.Api.Controllers;

using WordDocument = DocumentFormat.OpenXml.Wordprocessing.Document;
using QuestPdfDocument = QuestPDF.Fluent.Document;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public DocumentsController(AppDbContext db, IWebHostEnvironment env)
    {
        _db = db;
        _env = env;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(JwtRegisteredClaimNames.Sub) 
                    ?? User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null || !int.TryParse(claim.Value, out var userId))
            throw new Exception("User id not found in token.");

        return userId;
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var userId = GetUserId();

        var doc = await _db.GeneratedDocuments
            .AsNoTracking()
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doc == null)
            return NotFound();

        // vlasnik ili admin
        var isAdmin = await _db.Users
            .Where(u => u.Id == userId)
            .Select(u => u.IsAdmin)
            .FirstOrDefaultAsync();

        if (!isAdmin && doc.UserId != userId)
            return Forbid();

        Dictionary<string, string?> fields = new();

        if (!string.IsNullOrWhiteSpace(doc.FilledDataJson))
        {
            try
            {
                fields = JsonSerializer.Deserialize<Dictionary<string, string?>>(doc.FilledDataJson)
                        ?? new Dictionary<string, string?>();
            }
            catch
            {
                
            }
        }

        var dto = new GeneratedDocumentDetailsDto
        {
            Id = doc.Id,
            Title = doc.Title,
            TemplateId = doc.TemplateId,
            Fields = fields
        };

        return Ok(dto);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyDocuments(
        [FromQuery] string? search,
        [FromQuery] int? templateId,
        [FromQuery] DateTime? from,
        [FromQuery] DateTime? to)
    {
        var userId = GetUserId();

        var query = _db.GeneratedDocuments
            .Where(d => d.UserId == userId)
            .Include(d => d.Template)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(d => d.Title.Contains(search));
        }

        if (templateId.HasValue)
        {
            query = query.Where(d => d.TemplateId == templateId.Value);
        }

        if (from.HasValue)
        {
            query = query.Where(d => d.GeneratedAt >= from.Value);
        }

        if (to.HasValue)
        {
            query = query.Where(d => d.GeneratedAt <= to.Value);
        }

        var docs = await query
            .OrderByDescending(d => d.GeneratedAt)
            .Select(d => new GeneratedDocumentDto
            {
                Id = d.Id,
                Title = d.Title,
                GeneratedAt = d.GeneratedAt,
                DocxPath = d.DocxPath,
                PdfPath = d.PdfPath,
                TemplateId = d.TemplateId,
                TemplateName = d.Template != null ? d.Template.Name : string.Empty
            })
            .ToListAsync();

        return Ok(docs);
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] GenerateDocumentRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();

        var template = await _db.DocumentTemplates
            .FirstOrDefaultAsync(t => t.Id == req.TemplateId && t.IsActive);

        if (template == null)
            return BadRequest(new { message = "Nepostojeći ili neaktivan šablon." });

        var fields = req.Fields ?? new Dictionary<string, string?>();

        // 1) Popunjavanje plain-text sadržaja
        var content = template.Content ?? string.Empty;

        foreach (var kvp in fields)
        {
            var placeholder = "{{" + kvp.Key + "}}";
            var value = kvp.Value ?? string.Empty;

            // (case-sensitive je ok – placeholdere pišemo isto kao u šablonu)
            content = content.Replace(placeholder, value);
        }

        var filledJson = JsonSerializer.Serialize(fields);

        var title = $"{template.Name} - {DateTime.UtcNow:yyyy-MM-dd HH:mm}";

        // 2) Folder za generisane fajlove
        var documentsRoot = Path.Combine(_env.ContentRootPath, "GeneratedDocs");
        Directory.CreateDirectory(documentsRoot);

        // 3) Bezbedna imena fajlova
        var invalidChars = Path.GetInvalidFileNameChars();
        var safeTitle = new string(title.Select(ch =>
            invalidChars.Contains(ch) ? '_' : ch).ToArray());

        var docxFileName = $"{safeTitle}_{Guid.NewGuid():N}.docx";
        var pdfFileName = $"{safeTitle}_{Guid.NewGuid():N}.pdf";

        var docxFullPath = Path.Combine(documentsRoot, docxFileName);
        var pdfFullPath = Path.Combine(documentsRoot, pdfFileName);

        // Tekst koristimo za PDF (i za fallback DOCX)
        var normalized = content.Replace("\r\n", "\n");
        var lines = normalized.Split('\n');

        // 4) DOCX – ako postoji uploadovani šablon, koristimo njega;
        //    ako ne, pravimo osnovni DOCX iz plain teksta (kao do sada).
        var hasDocxTemplate = !string.IsNullOrWhiteSpace(template.DocxTemplatePath);

        if (hasDocxTemplate)
        {
            var templatesRoot = Path.Combine(_env.ContentRootPath, "DocxTemplates");
            Directory.CreateDirectory(templatesRoot);

            var templatePath = Path.Combine(templatesRoot, template.DocxTemplatePath!);
            if (!System.IO.File.Exists(templatePath))
            {
                return BadRequest(new { message = "DOCX šablon ne postoji na serveru." });
            }

            // napravimo kopiju kao novi dokument
            System.IO.File.Copy(templatePath, docxFullPath, overwrite: false);

            // zamena placeholdera unutar DOCX fajla
            using (var wordDocument = WordprocessingDocument.Open(docxFullPath, true))
            {
                var textElements = wordDocument.MainDocumentPart!
                    .Document
                    .Descendants<Text>();

                foreach (var text in textElements)
                {
                    if (string.IsNullOrEmpty(text.Text))
                        continue;

                    foreach (var kvp in fields)
                    {
                        var placeholder = "{{" + kvp.Key + "}}";
                        var value = kvp.Value ?? string.Empty;

                        if (text.Text.Contains(placeholder))
                        {
                            text.Text = text.Text.Replace(placeholder, value);
                        }
                    }
                }

                wordDocument.MainDocumentPart.Document.Save();
            }
        }
        else
        {
            // Fallback – generiši jednostavan DOCX iz plain teksta kao do sada
            using (var wordDocument = WordprocessingDocument.Create(
                    docxFullPath,
                    WordprocessingDocumentType.Document))
            {
                MainDocumentPart mainPart = wordDocument.AddMainDocumentPart();
                mainPart.Document = new WordDocument();

                var body = mainPart.Document.AppendChild(new Body());

                foreach (var line in lines)
                {
                    var paragraph = new Paragraph();
                    var run = new Run(new Text(line ?? string.Empty)
                    {
                        Space = SpaceProcessingModeValues.Preserve
                    });

                    paragraph.AppendChild(run);
                    body.AppendChild(paragraph);
                }

                mainPart.Document.Save();
            }
        }

        // 5) PDF generišemo kao i do sada – iz plain teksta (QuestPDF)
        var pdfDocument = QuestPdfDocument.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(40);

                page.Content().Column(col =>
                {
                    bool isFirstLine = true;

                    foreach (var line in lines)
                    {
                        var currentLine = line ?? string.Empty;

                        if (string.IsNullOrWhiteSpace(currentLine))
                        {
                            col.Item().Height(8);
                            continue;
                        }

                        if (isFirstLine)
                        {
                            col.Item().Text(currentLine)
                                .FontSize(12)
                                .Bold();

                            isFirstLine = false;
                        }
                        else
                        {
                            col.Item().Text(currentLine)
                                .FontSize(11);
                        }
                    }
                });
            });
        });

        pdfDocument.GeneratePdf(pdfFullPath);

        // 6) Upis u bazu
        var generated = new GeneratedDocument
        {
            Title = title,
            TemplateId = template.Id,
            UserId = userId,
            GeneratedAt = DateTime.UtcNow,
            DocxPath = docxFileName,
            PdfPath = pdfFileName,
            FilledDataJson = filledJson
        };

        _db.GeneratedDocuments.Add(generated);
        await _db.SaveChangesAsync();

        return Ok(new GeneratedDocumentDto
        {
            Id = generated.Id,
            Title = generated.Title,
            GeneratedAt = generated.GeneratedAt,
            DocxPath = generated.DocxPath,
            PdfPath = generated.PdfPath,
            TemplateId = generated.TemplateId,
            TemplateName = template.Name
        });
    }

    /// Pomocna metoda za kreiranje paragrafa za potpis u Word-u
    private Paragraph CreateSignatureParagraph(
        string text,
        JustificationValues justification,
        bool isBold = false,
        string fontSize = "24") // default 12pt
    {
        var paragraph = new Paragraph();

        var paragraphProps = new ParagraphProperties(
            new Justification { Val = justification },
            new SpacingBetweenLines
            {
                After = "80",
                Line = "240",
                LineRule = LineSpacingRuleValues.Auto
            }
        );

        paragraph.ParagraphProperties = paragraphProps;

        var run = new Run();

        var runProps = new RunProperties(
            new RunFonts
            {
                Ascii = "Times New Roman",
                HighAnsi = "Times New Roman"
            },
            new FontSize { Val = fontSize }
        );

        if (isBold)
        {
            runProps.Append(new Bold());
        }

        run.RunProperties = runProps;

        run.AppendChild(new Text(text ?? string.Empty)
        {
            Space = SpaceProcessingModeValues.Preserve
        });

        paragraph.AppendChild(run);
        return paragraph;
    }

    [HttpGet("{id:int}/download/docx")]
    public async Task<IActionResult> DownloadDocx(int id)
    {
        var userId = GetUserId();

        var doc = await _db.GeneratedDocuments
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doc == null)
            return NotFound();

        if (doc.UserId != userId)
            return Forbid();

        var fullPath = Path.Combine(_env.ContentRootPath, "GeneratedDocs", doc.DocxPath);

        if (!System.IO.File.Exists(fullPath))
            return NotFound(new { message = "Fajl ne postoji na serveru." });

        var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
        var fileName = Path.GetFileName(doc.DocxPath);

        return File(fileBytes, 
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            fileName);
    }

    [HttpGet("{id:int}/download/pdf")]
    public async Task<IActionResult> DownloadPdf(int id)
    {
        var userId = GetUserId();

        var doc = await _db.GeneratedDocuments
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doc == null)
            return NotFound();

        if (doc.UserId != userId)
            return Forbid();

        var fullPath = Path.Combine(_env.ContentRootPath, "GeneratedDocs", doc.PdfPath);

        if (!System.IO.File.Exists(fullPath))
            return NotFound(new { message = "Fajl ne postoji na serveru." });

        var fileBytes = await System.IO.File.ReadAllBytesAsync(fullPath);
        var fileName = Path.GetFileName(doc.PdfPath);

        return File(fileBytes, "application/pdf", fileName);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = GetUserId();

        var doc = await _db.GeneratedDocuments
            .FirstOrDefaultAsync(d => d.Id == id);

        if (doc == null)
            return NotFound();

        var isAdmin = await _db.Users
            .Where(u => u.Id == userId)
            .Select(u => u.IsAdmin)
            .FirstOrDefaultAsync();

        if (!isAdmin && doc.UserId != userId)
        {
            return Forbid();
        }

        try
        {
            if (!string.IsNullOrWhiteSpace(doc.DocxPath))
            {
                var fullDocxPath = Path.Combine(_env.ContentRootPath, "GeneratedDocs", doc.DocxPath);
                if (System.IO.File.Exists(fullDocxPath))
                    System.IO.File.Delete(fullDocxPath);
            }

            if (!string.IsNullOrWhiteSpace(doc.PdfPath))
            {
                var fullPdfPath = Path.Combine(_env.ContentRootPath, "GeneratedDocs", doc.PdfPath);
                if (System.IO.File.Exists(fullPdfPath))
                    System.IO.File.Delete(fullPdfPath);
            }
        }
        catch
        {
        }

        _db.GeneratedDocuments.Remove(doc);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
