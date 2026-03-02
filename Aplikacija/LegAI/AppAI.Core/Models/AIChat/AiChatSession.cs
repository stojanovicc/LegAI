using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AppAI.Core.Models.AIChat
{
    public class AiChatSession
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string UserId { get; set; } = null!;

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = "AI razgovor";

        // Kada je kreirana sesija
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Kada je poslednji put azurirana (nova poruka)
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<AiMessage> Messages { get; set; } = new List<AiMessage>();
    }
}
