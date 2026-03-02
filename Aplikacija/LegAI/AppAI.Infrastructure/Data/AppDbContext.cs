using AppAI.Core.Entities;
using AppAI.Core.Models.AIChat;
using Microsoft.EntityFrameworkCore;

namespace AppAI.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<ApplicationUser> Users { get; set; } = null!;
    public DbSet<DocumentTemplate> DocumentTemplates { get; set; } = null!;
    public DbSet<GeneratedDocument> GeneratedDocuments { get; set; } = null!;
    public DbSet<AiChatSession> AiChatSessions { get; set; } = null!;
    public DbSet<AiMessage> AiMessages { get; set; } = null!;


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ApplicationUser>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<GeneratedDocument>()
            .HasOne(d => d.Template)
            .WithMany(t => t.GeneratedDocuments)
            .HasForeignKey(d => d.TemplateId);

        modelBuilder.Entity<GeneratedDocument>()
            .HasOne(d => d.User)
            .WithMany(u => u.GeneratedDocuments)
            .HasForeignKey(d => d.UserId);

        modelBuilder.Entity<AiChatSession>()
            .HasMany(s => s.Messages)
            .WithOne(m => m.Session)
            .HasForeignKey(m => m.SessionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
