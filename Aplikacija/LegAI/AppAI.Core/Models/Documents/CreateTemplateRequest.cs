using System.ComponentModel.DataAnnotations;
//Admin pravi sablon
namespace AppAI.Core.Models.Documents;

public class CreateTemplateRequest
{
    [Required]
    public string Name { get; set; } = null!;

    [Required]
    public string Category { get; set; } = null!;

    [Required]
    public string Description { get; set; } = null!;
}
