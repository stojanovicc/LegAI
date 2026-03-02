using System;
using System.ComponentModel.DataAnnotations;

namespace AppAI.Core.Models.AIChat
{
    public class AiMessage
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int SessionId { get; set; }

        [Required]
        [MaxLength(20)]
        public string Sender { get; set; } = "user";

        [Required]
        public string Text { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual AiChatSession Session { get; set; } = null!;
    }
}
