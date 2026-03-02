using System.ComponentModel.DataAnnotations;

namespace AppAI.Core.Models.AI;

public class ExplainClauseRequest
{
    [Required]
    public string Text { get; set; } = null!;
}
