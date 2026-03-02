namespace AppAI.Core.Models.Documents;

public class TemplateDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Category { get; set; } = null!;
    public string Description { get; set; } = null!;
    public string Content { get; set; } = string.Empty;
}