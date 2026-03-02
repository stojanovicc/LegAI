using System.ComponentModel.DataAnnotations;

namespace AppAI.Core.Models.Auth;

public class RegisterRequest
{
    [Required, EmailAddress]
    public string Email { get; set; } = null!;

    [Required, MinLength(6)]
    public string Password { get; set; } = null!;

    [Required]
    public string FullName { get; set; } = null!;

    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }
}
