namespace AppAI.Core.Config;

public class OpenAISettings
{
    public string ApiKey { get; set; } = null!;
    public string Model { get; set; } = "gpt-4.1-mini";
}
