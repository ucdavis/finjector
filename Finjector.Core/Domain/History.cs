using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Finjector.Core.Domain
{
    public class History
    {
        [Key]
        public int Id { get; set; }

        public int TeamId { get; set; }
        [Required]
        public Team Team { get; set; } = null!;

        public int? FolderId { get; set; }
        public Folder? Folder { get; set; }

        public int userId { get; set; }
        [Required]
        public User User { get; set; } = null!;

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(50)]
        public string Action { get; set; } = string.Empty;

        [MaxLength(300)]
        public string Description { get; set; } = string.Empty;
    }
}
