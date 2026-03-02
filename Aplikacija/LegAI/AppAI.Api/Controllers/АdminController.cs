using AppAI.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace AppAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    private int GetUserId()
    {
        var claim = User.FindFirst(JwtRegisteredClaimNames.Sub)
                    ?? User.FindFirst(ClaimTypes.NameIdentifier);

        if (claim == null || !int.TryParse(claim.Value, out var userId))
            throw new Exception("User id not found in token.");

        return userId;
    }

    private async Task<bool> IsCurrentUserAdmin()
    {
        var userId = GetUserId();

        return await _db.Users
            .Where(u => u.Id == userId)
            .Select(u => u.IsAdmin)
            .FirstOrDefaultAsync();
    }

    // 1) Lista svih korisnika
    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        if (!await IsCurrentUserAdmin())
            return Forbid();

        var users = await _db.Users
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.FullName,
                u.Address,
                u.PhoneNumber,
                u.CreatedAt,
                u.IsAdmin,
                DocumentsCount = u.GeneratedDocuments.Count
            })
            .OrderByDescending(u => u.CreatedAt)
            .ToListAsync();

        return Ok(users);
    }

    // 2) Osnovne statistike
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        if (!await IsCurrentUserAdmin())
            return Forbid();

        var totalUsers = await _db.Users.CountAsync();
        var totalDocs = await _db.GeneratedDocuments.CountAsync();
        var totalTemplates = await _db.DocumentTemplates.CountAsync();

        return Ok(new
        {
            totalUsers,
            totalDocs,
            totalTemplates
        });
    }
}