using System.ComponentModel.DataAnnotations;

namespace AppAI.Core.Models.Profile;

public class UpdateProfileRequest
{
    [Required]
    public string FullName { get; set; } = null!;

    public string? Address { get; set; }

    public string? PhoneNumber { get; set; }
}
