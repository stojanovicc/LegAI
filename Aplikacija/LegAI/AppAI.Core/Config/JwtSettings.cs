namespace AppAI.Core.Config;

public class JwtSettings
{
    public string SecretKey { get; set; } = null!;
    public string Issuer { get; set; } = "AppAI";
    public string Audience { get; set; } = "AppAIClient";
    public int ExpiryMinutes { get; set; } = 60;
}
