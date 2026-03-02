using System.ComponentModel.DataAnnotations;

namespace AppAI.Core.Models.AI;

public class SuggestTemplateRequest
{
    [Required]
    public string Description { get; set; } = null!;
}
