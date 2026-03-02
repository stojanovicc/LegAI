namespace AppAI.Core.Models.Documents;
public class GeneratedDocumentDetailsDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public int TemplateId { get; set; }
    public Dictionary<string, string?> Fields { get; set; } = new();
}

