using System.Security.Claims;
using AppAI.Core.Models.AIChat;
using AppAI.Core.Services;
using AppAI.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiChatController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IOpenAIService _ai;

    public AiChatController(AppDbContext db, IOpenAIService ai)
    {
        _db = db;
        _ai = ai;
    }

    private string GetUserId() =>
        User.FindFirstValue(ClaimTypes.NameIdentifier)
        ?? throw new Exception("User id not found");

    public record CreateSessionRequest(string? Title, string? FirstMessage);
    public record SendMessageRequest(string Text);

    // ---------------- 1) Moje sesije ----------------
    [HttpGet("sessions/my")]
    public async Task<IActionResult> GetMySessions()
    {
        var userId = GetUserId();

        var sessions = await _db.AiChatSessions
            .Where(s => s.UserId == userId)
            .OrderByDescending(s => s.UpdatedAt)
            .Take(30)
            .Select(s => new
            {
                s.Id,
                s.Title,
                s.CreatedAt,
                s.UpdatedAt,
                LastMessage = s.Messages
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => m.Text)
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(sessions);
    }

    // ---------------- 2) Poruke u sesiji ----------------
    [HttpGet("sessions/{id:int}")]
    public async Task<IActionResult> GetSession(int id)
    {
        var userId = GetUserId();

        var session = await _db.AiChatSessions
            .Include(s => s.Messages)
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (session == null) return NotFound();

        var result = new
        {
            session.Id,
            session.Title,
            session.CreatedAt,
            session.UpdatedAt,
            Messages = session.Messages
                .OrderBy(m => m.CreatedAt)
                .Select(m => new
                {
                    m.Id,
                    m.Sender,
                    m.Text,
                    m.CreatedAt
                })
        };

        return Ok(result);
    }

    // ---------------- 3) Nova sesija ----------------
    [HttpPost("sessions")]
    public async Task<IActionResult> CreateSession([FromBody] CreateSessionRequest req)
    {
        var userId = GetUserId();

        var title = string.IsNullOrWhiteSpace(req.Title)
            ? "AI razgovor"
            : req.Title.Trim();

        var session = new AiChatSession
        {
            UserId = userId,
            Title = title
        };

        _db.AiChatSessions.Add(session);
        await _db.SaveChangesAsync();

        if (!string.IsNullOrWhiteSpace(req.FirstMessage))
        {
            return await SendMessageInternal(session, req.FirstMessage);
        }

        return Ok(new { session.Id, session.Title });
    }

    // ---------------- 4) Slanje poruke ----------------
    [HttpPost("sessions/{id:int}/messages")]
    public async Task<IActionResult> SendMessage(int id, [FromBody] SendMessageRequest req)
    {
        var userId = GetUserId();

        var session = await _db.AiChatSessions
            .Include(s => s.Messages)
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (session == null) return NotFound();

        return await SendMessageInternal(session, req.Text);
    }

    private async Task<IActionResult> SendMessageInternal(AiChatSession session, string userText)
    {
        if (string.IsNullOrWhiteSpace(userText))
            return BadRequest("Text is required.");

        var trimmed = userText.Trim();

        // 1) Sačuvaj USER poruku u bazi
        var userMessage = new AiMessage
        {
            SessionId = session.Id,
            Sender = "user",
            Text = trimmed,
            CreatedAt = DateTime.UtcNow
        };

        _db.AiMessages.Add(userMessage);
        await _db.SaveChangesAsync();

        // 2) PRIPOJNI PROMPT – koristimo SAMO poslednje pitanje
        var systemPrompt =
            "Ti si pravni asistent koji daje kratka i jasna objašnjenja. " +
            "Ne koristi uvodne fraze poput 'Zdravo', 'Ćao' ili 'Kako mogu da pomognem'. " +
            "Ne piši napomene da odgovor nije pravni savet i ne upućuj korisnika na advokata, " +
            "osim ako to korisnik izričito ne traži. " +
            "Odmah odgovori direktno na suštinu pitanja. " +
            "Odgovaraj isključivo na srpskom jeziku.";

        // umesto da skupljamo istoriju iz baze, direktno saljemo poslednje pitanje
        var userPrompt = $"Korisnik: {trimmed}";

        var aiAnswer = await _ai.GetCompletionAsync(systemPrompt, userPrompt);

        // 3) Sačuvaj AI poruku
        var assistantMessage = new AiMessage
        {
            SessionId = session.Id,
            Sender = "assistant",
            Text = aiAnswer,
            CreatedAt = DateTime.UtcNow
        };

        _db.AiMessages.Add(assistantMessage);

        // 4) Azuriraj sesiju (naslov + vreme)
        session.UpdatedAt = DateTime.UtcNow;

        if (session.Title == "AI razgovor")
        {
            session.Title = trimmed.Length > 60 ? trimmed[..60] + "..." : trimmed;
        }

        await _db.SaveChangesAsync();

        return Ok(new
        {
            session.Id,
            Messages = new[]
            {
                new { userMessage.Id, userMessage.Sender, userMessage.Text, userMessage.CreatedAt },
                new { assistantMessage.Id, assistantMessage.Sender, assistantMessage.Text, assistantMessage.CreatedAt }
            }
        });
    }

    // ---------------- 5) Brisanje sesije ----------------
    [HttpDelete("sessions/{id:int}")]
    public async Task<IActionResult> DeleteSession(int id)
    {
        var userId = GetUserId();

        var session = await _db.AiChatSessions
            .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId);

        if (session == null) return NotFound();

        _db.AiChatSessions.Remove(session);
        await _db.SaveChangesAsync();

        return Ok();
    }
}
