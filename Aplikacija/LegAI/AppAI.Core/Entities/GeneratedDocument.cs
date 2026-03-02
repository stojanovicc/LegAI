namespace AppAI.Core.Entities;

public class GeneratedDocument
{
    public int Id { get; set; }

    public string Title { get; set; } = null!;

    public int TemplateId { get; set; }
    public DocumentTemplate Template { get; set; } = null!;

    public int UserId { get; set; }
    public ApplicationUser User { get; set; } = null!;

    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;

    public string DocxPath { get; set; } = null!;
    public string PdfPath { get; set; } = null!;
    public string FilledDataJson { get; set; } = null!;
}
