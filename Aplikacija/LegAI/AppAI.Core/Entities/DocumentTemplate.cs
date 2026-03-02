namespace AppAI.Core.Entities;

public class DocumentTemplate
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string Category { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Content { get; set; } = string.Empty;

    public string? DocxTemplatePath { get; set; }
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public ICollection<GeneratedDocument> GeneratedDocuments { get; set; } = new List<GeneratedDocument>();
}
