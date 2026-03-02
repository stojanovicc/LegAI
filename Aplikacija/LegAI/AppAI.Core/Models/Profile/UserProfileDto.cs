using AppAI.Core.Models.Documents;

namespace AppAI.Core.Models.Profile;

public class UserProfileDto
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;

    public string FullName { get; set; } = null!;

    public string? Address { get; set; }

    public string? PhoneNumber { get; set; }

    public bool IsAdmin { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<GeneratedDocumentDto> Documents { get; set; } = new();
}
