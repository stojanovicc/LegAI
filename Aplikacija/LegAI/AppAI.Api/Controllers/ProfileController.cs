using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using AppAI.Core.Models.Profile;
using AppAI.Core.Models.Documents;
using AppAI.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace AppAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _db;

    public ProfileController(AppDbContext db)
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

    [HttpGet("me")]
    public async Task<ActionResult<UserProfileDto>> GetMyProfile()
    {
        var userIdClaim = User.FindFirst(JwtRegisteredClaimNames.Sub) 
                          ?? User.FindFirst(ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            return Unauthorized();

        var user = await _db.Users
            .Include(u => u.GeneratedDocuments)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound();

        var profile = new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Address = user.Address,
            PhoneNumber = user.PhoneNumber,
            IsAdmin = user.IsAdmin,
            CreatedAt = user.CreatedAt,
            Documents = user.GeneratedDocuments
                .OrderByDescending(d => d.GeneratedAt)
                .Select(d => new GeneratedDocumentDto
                {
                    Id = d.Id,
                    Title = d.Title,
                    GeneratedAt = d.GeneratedAt,
                    DocxPath = d.DocxPath,
                    PdfPath = d.PdfPath
                })
                .ToList()
        };

        return Ok(profile);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateProfileRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userId = GetUserId();

        var user = await _db.Users
            .Include(u => u.GeneratedDocuments)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return NotFound();

        user.FullName = req.FullName;
        user.Address = req.Address;
        user.PhoneNumber = req.PhoneNumber;

        await _db.SaveChangesAsync();

        var profile = new UserProfileDto
        {
            Id = user.Id,
            Email = user.Email,
            FullName = user.FullName,
            Address = user.Address,
            PhoneNumber = user.PhoneNumber,
            IsAdmin = user.IsAdmin,
            CreatedAt = user.CreatedAt,
            Documents = user.GeneratedDocuments
                .OrderByDescending(d => d.GeneratedAt)
                .Select(d => new GeneratedDocumentDto
                {
                    Id = d.Id,
                    Title = d.Title,
                    GeneratedAt = d.GeneratedAt,
                    DocxPath = d.DocxPath,
                    PdfPath = d.PdfPath,
                    TemplateId = d.TemplateId,
                    TemplateName = d.Template != null ? d.Template.Name : string.Empty
                })
                .ToList()
        };

        return Ok(profile);
    }

}
