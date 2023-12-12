using Microsoft.EntityFrameworkCore;
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

        public int UserId { get; set; }
        [Required]
        public User User { get; set; } = null!;

        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(50)]
        public string Action { get; set; } = string.Empty;

        [MaxLength(300)]
        public string Description { get; set; } = string.Empty;

        internal static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<History>().HasOne(a => a.User).WithMany().HasForeignKey(a => a.UserId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<History>().HasOne(a => a.Team).WithMany().HasForeignKey(a => a.TeamId).OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<History>().HasOne(a => a.Folder).WithMany().HasForeignKey(a => a.FolderId).OnDelete(DeleteBehavior.Restrict);
        }
    }
}
