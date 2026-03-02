namespace AppAI.Core.Services;

public interface IOpenAIService
{
    Task<string> GetCompletionAsync(string systemPrompt, string userPrompt);
}
