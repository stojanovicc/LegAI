using System.ComponentModel.DataAnnotations;

namespace AppAI.Core.Models.Documents;

public class UpdateTemplateRequest
{
    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public string Category { get; set; } = null!;

    [Required]
    public string Description { get; set; } = null!;

    public bool IsActive { get; set; } = true;
}
