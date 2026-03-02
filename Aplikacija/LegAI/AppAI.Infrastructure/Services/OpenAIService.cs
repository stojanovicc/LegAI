using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using AppAI.Core.Config;
using AppAI.Core.Services;
using Microsoft.Extensions.Options;

namespace AppAI.Infrastructure.Services;

public class OpenAIService : IOpenAIService
{
    private readonly HttpClient _httpClient;
    private readonly OpenAISettings _settings;

    public OpenAIService(HttpClient httpClient, IOptions<OpenAISettings> options)
    {
        _httpClient = httpClient;
        _settings = options.Value;
    }

    public async Task<string> GetCompletionAsync(string systemPrompt, string userPrompt)
    {
        if (string.IsNullOrWhiteSpace(_settings.ApiKey))
            throw new InvalidOperationException("OpenAI API key nije podešen.");

        var requestBody = new
        {
            model = _settings.Model,
            messages = new[]
            {
                new { role = "system", content = systemPrompt },
                new { role = "user", content = userPrompt }
            },
            temperature = 0.2
        };

        var json = JsonSerializer.Serialize(requestBody);
        var httpRequest = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/chat/completions")
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };

        httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _settings.ApiKey);

        var response = await _httpClient.SendAsync(httpRequest);
        if (!response.IsSuccessStatusCode)
        {
            var errorText = await response.Content.ReadAsStringAsync();

            // ako je potrošen kredit
            if ((int)response.StatusCode == 429 || errorText.Contains("insufficient_quota"))
            {
                // vrati objasnjenje koje ćeš prikazati korisniku
                return "AI servis trenutno nije dostupan jer je potrošen raspoloživi kredit ili je ograničen plan korišćenja. " +
                    "Obratite se administratoru sistema da obnovi ili proširi kvotu.";
            }

            throw new Exception($"OpenAI API error: {response.StatusCode} - {errorText}");
        }

        var responseText = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(responseText);

        var content = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString();

        return content ?? string.Empty;
    }
}
