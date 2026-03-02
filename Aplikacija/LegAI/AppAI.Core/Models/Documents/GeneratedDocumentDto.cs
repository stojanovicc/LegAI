namespace AppAI.Core.Models.Documents;

public class GeneratedDocumentDto
{
    public int Id { get; set; }
    public string Title { get; set; } = null!;
    public DateTime GeneratedAt { get; set; }

    public string DocxPath { get; set; } = null!;
    public string PdfPath { get; set; } = null!;

    public int TemplateId { get; set; }
    public string? TemplateName { get; set; }
}
