using System.ComponentModel.DataAnnotations;

namespace AppAI.Core.Models.Documents;

public class GenerateDocumentRequest
{
    [Required]
    public int TemplateId { get; set; }

    [Required]
    public Dictionary<string, string?> Fields { get; set; } = new();
}
