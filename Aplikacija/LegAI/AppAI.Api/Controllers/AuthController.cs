using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AppAI.Core.Config;
using AppAI.Core.Entities;
using AppAI.Core.Models.Auth;
using AppAI.Infrastructure.Data;
using AppAI.Infrastructure.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace AppAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly JwtSettings _jwt;

    public AuthController(AppDbContext db, IPasswordHasher hasher, IOptions<JwtSettings> jwtOptions)
    {
        _db = db;
        _hasher = hasher;
        _jwt = jwtOptions.Value;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var exists = await _db.Users.AnyAsync(u => u.Email == req.Email);
        if (exists)
            return BadRequest(new { message = "Korisnik sa ovim email-om već postoji." });

        // da li je ovo prvi korisnik u sistemu
        var isFirstUser = !await _db.Users.AnyAsync();

        // definisemo “specijalni” admin email
        var adminEmail = "admin@appai.com";

        // logika: admin je ili prvi user, ili onaj sa ovim email-om
        var isAdmin = isFirstUser || 
                    string.Equals(req.Email, adminEmail, StringComparison.OrdinalIgnoreCase);

        var user = new ApplicationUser
        {
            Email = req.Email,
            FullName = req.FullName,
            Address = req.Address,
            PhoneNumber = req.PhoneNumber,
            PasswordHash = _hasher.HashPassword(req.Password),
            CreatedAt = DateTime.UtcNow,
            IsAdmin = isAdmin
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Registracija uspešna." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == req.Email);
        if (user == null || !_hasher.VerifyPassword(req.Password, user.PasswordHash))
            return Unauthorized(new { message = "Pogrešan email ili lozinka." });

        var token = GenerateToken(user);

        return Ok(new { token });
    }

    private string GenerateToken(ApplicationUser user)
    {
        var handler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_jwt.SecretKey);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(JwtRegisteredClaimNames.Email, user.Email)
        };

        var descriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_jwt.ExpiryMinutes),
            Issuer = _jwt.Issuer,
            Audience = _jwt.Audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256)
        };

        var token = handler.CreateToken(descriptor);
        return handler.WriteToken(token);
    }
}
