using AppAI.Core.Entities;
using AppAI.Core.Models.Documents;
using AppAI.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.IO;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Text.RegularExpressions;

namespace AppAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TemplatesController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IWebHostEnvironment _env;

    public TemplatesController(AppDbContext db, IWebHostEnvironment env)
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

    private async Task<bool> IsCurrentUserAdmin()
    {
        var userId = GetUserId();

        return await _db.Users
            .Where(u => u.Id == userId)
            .Select(u => u.IsAdmin)
            .FirstOrDefaultAsync();
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<TemplateDto>>> GetAll(
        [FromQuery] string? category,
        [FromQuery] string? search)
    {
        var query = _db.DocumentTemplates
            .Where(t => t.IsActive)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
        {
            query = query.Where(t => t.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(t =>
                t.Name.Contains(search));
        }

        var templates = await query
            .OrderBy(t => t.Name)
            .Select(t => new TemplateDto
            {
                Id = t.Id,
                Name = t.Name,
                Category = t.Category,
                Description = t.Description,
                Content = t.Content
            })
            .ToListAsync();

        return Ok(templates);
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<TemplateDto>> GetById(int id)
    {
        var t = await _db.DocumentTemplates.FindAsync(id);
        if (t == null || !t.IsActive) return NotFound();

        var dto = new TemplateDto
        {
            Id = t.Id,
            Name = t.Name,
            Category = t.Category,
            Description = t.Description,
            Content = t.Content
        };

        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTemplateRequest req)
    {
        if (!await IsCurrentUserAdmin())
            return Forbid();

        if (!ModelState.IsValid) return BadRequest(ModelState);

        var template = new DocumentTemplate
        {
            Name = req.Name,
            Category = req.Category,
            Description = req.Description,
            Content = string.Empty,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        _db.DocumentTemplates.Add(template);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = template.Id }, new { template.Id });
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTemplateRequest req)
    {
        if (!await IsCurrentUserAdmin())
            return Forbid();

        if (!ModelState.IsValid) return BadRequest(ModelState);

        var template = await _db.DocumentTemplates.FindAsync(id);
        if (template == null) return NotFound();

        template.Name = req.Name;
        template.Category = req.Category;
        template.IsActive = req.IsActive;
        template.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!await IsCurrentUserAdmin())
            return Forbid();

        var template = await _db.DocumentTemplates.FindAsync(id);
        if (template == null) 
            return NotFound();

        template.IsActive = false;

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id:int}/placeholders")]
    public async Task<IActionResult> GetPlaceholders(int id)
    {
        var template = await _db.DocumentTemplates.FindAsync(id);
        if (template == null || !template.IsActive)
            return NotFound();

        var content = template.Content ?? string.Empty;

        var matches = System.Text.RegularExpressions.Regex
            .Matches(content, "{{(.*?)}}");

        var fields = matches
            .Select(m => m.Groups[1].Value.Trim())
            .Distinct()
            .ToList();

        return Ok(new { fields });
    }

    [HttpPost("{id:int}/upload-docx")]
    [RequestSizeLimit(10 * 1024 * 1024)]
    public async Task<IActionResult> UploadDocxTemplate(int id, IFormFile file)
    {
        if (!await IsCurrentUserAdmin())
            return Forbid();

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Fajl nije prosleđen." });

        var ext = Path.GetExtension(file.FileName);
        if (!string.Equals(ext, ".docx", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Dozvoljeni su samo DOCX fajlovi." });

        var template = await _db.DocumentTemplates.FindAsync(id);
        if (template == null)
            return NotFound();

        var templatesRoot = Path.Combine(_env.ContentRootPath, "DocxTemplates");
        Directory.CreateDirectory(templatesRoot);

        // obriši stari fajl ako postoji
        if (!string.IsNullOrEmpty(template.DocxTemplatePath))
        {
            var oldPath = Path.Combine(templatesRoot, template.DocxTemplatePath);
            if (System.IO.File.Exists(oldPath))
            {
                System.IO.File.Delete(oldPath);
            }
        }

        // bezbedno ime fajla
        var invalidChars = Path.GetInvalidFileNameChars();
        var baseName = Path.GetFileNameWithoutExtension(file.FileName);
        var safeBase = new string(baseName.Select(ch =>
            invalidChars.Contains(ch) ? '_' : ch).ToArray());

        var fileName = $"{safeBase}_{Guid.NewGuid():N}.docx";
        var fullPath = Path.Combine(templatesRoot, fileName);

        using (var stream = new FileStream(fullPath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // OVDE ČITAMO PLACEHOLDERE IZ DOCX-a
        var placeholders = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        var regex = new Regex(@"\{\{(.*?)\}\}", RegexOptions.Compiled);

        using (var wordDoc = WordprocessingDocument.Open(fullPath, false))
        {
            var texts = wordDoc.MainDocumentPart!
                .Document
                .Descendants<Text>();

            foreach (var t in texts)
            {
                if (string.IsNullOrEmpty(t.Text)) continue;

                foreach (Match m in regex.Matches(t.Text))
                {
                    var name = m.Groups[1].Value.Trim();
                    if (!string.IsNullOrEmpty(name))
                    {
                        placeholders.Add(name);
                    }
                }
            }
        }

        // npr. upišemo ih u Content kao liste:
        // {{ImeZakupodavca}}\n{{ImeZakupca}}\n{{AdresaStana}}
        template.DocxTemplatePath = fileName;
        template.Content = string.Join(
            Environment.NewLine,
            placeholders.Select(p => "{{" + p + "}}"));

        template.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return Ok(new
        {
            template.Id,
            template.DocxTemplatePath
        });
    }
}
