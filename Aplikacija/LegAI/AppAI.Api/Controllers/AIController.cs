using System.Text.Json;
using AppAI.Core.Models.AI;
using AppAI.Core.Services;
using AppAI.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AppAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AIController : ControllerBase
{
    private readonly IOpenAIService _ai;
    private readonly AppDbContext _db;

    public AIController(IOpenAIService ai, AppDbContext db)
    {
        _ai = ai;
        _db = db;
    }

    //ovu metodu ipak ne koristim nigde
    [HttpPost("explain")]
    public async Task<IActionResult> ExplainClause([FromBody] ExplainClauseRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var systemPrompt =
            "Ti si pravni asistent. Objasni korisniku jednostavnim i jasnim jezikom " +
            "značenje pravnog teksta ili klauzule. " +
            "Ne govori nikakve napomene, upozorenja ili poruke tipa 'ovo nije pravni savet'. " +
            "Odmah pređi na objašnjenje. " +
            "Odgovaraj isključivo na srpskom jeziku.";

        var answer = await _ai.GetCompletionAsync(systemPrompt, req.Text);

        return Ok(new { explanation = answer });
    }

    [HttpPost("suggest-template")]
    public async Task<IActionResult> SuggestTemplate([FromBody] SuggestTemplateRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var templates = await _db.DocumentTemplates
            .Where(t => t.IsActive)
            .OrderBy(t => t.Name)
            .Select(t => new
            {
                t.Id,
                t.Name,
                t.Category,
                t.Description
            })
            .ToListAsync();

        if (!templates.Any())
            return Ok(new { suggestions = Array.Empty<int>() });

        // pripremi listu šablona za prompt
        var listText = string.Join("\n", templates.Select(t =>
            $"ID: {t.Id}, Naziv: {t.Name}, Kategorija: {t.Category}, Opis: {t.Description}"));

        var systemPrompt =
            "Ti si pravni asistent koji pomaže korisniku da izabere šablon pravnog dokumenta. " +
            "Na osnovu opisa situacije, izaberi najprikladnije šablone iz liste. " +
            "Vrati SAMO listu ID-jeva razdvojenu zarezima, bez dodatnog teksta. " +
            "Na primer: 1,3,5";

        var userPrompt =
            $"Opis situacije korisnika:\n{req.Description}\n\n" +
            $"Dostupni šabloni:\n{listText}";

        var raw = await _ai.GetCompletionAsync(systemPrompt, userPrompt);

        // pokusaj da parsiras "1,3,5" u listu intova
        var ids = new List<int>();
        var parts = raw.Split(new[] { ',', '\n', ' ' }, StringSplitOptions.RemoveEmptyEntries);
        foreach (var part in parts)
        {
            if (int.TryParse(part.Trim(), out var id))
                ids.Add(id);
        }

        // filtriraj samo postojece ID-ove, za svaki slucaj
        var validIds = templates
            .Where(t => ids.Contains(t.Id))
            .Select(t => t.Id)
            .ToList();

        return Ok(new { suggestions = validIds });
    }
}
