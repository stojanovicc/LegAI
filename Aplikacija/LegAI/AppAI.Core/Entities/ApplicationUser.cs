namespace AppAI.Core.Entities;

public class ApplicationUser
{
    public int Id { get; set; }

    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;

    public string FullName { get; set; } = null!;
    public string? Address { get; set; }
    public string? PhoneNumber { get; set; }

    public bool IsAdmin { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<GeneratedDocument> GeneratedDocuments { get; set; } = new List<GeneratedDocument>();
}
