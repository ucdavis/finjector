using Microsoft.Azure.Cosmos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Finjector.Core.Domain
{
    public class Team
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        [Display(Name = "Team Name")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(300)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
        public bool IsPersonal { get; set; } = true;

        public int OwnerId { get; set; }
        [Required]
        public User Owner { get; set; } = null!;

        [JsonIgnore]
        public List<Folder> Folders { get; set; } = new List<Folder>();

        [JsonIgnore]
        public List<TeamPermission> TeamPermissions { get; set; } = new List<TeamPermission>();
        
        [NotMapped]
        public static string PersonalTeamName = "Personal";

        internal static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Folder>()
                .HasOne(a => a.Team)
                .WithMany(a => a.Folders)
                .HasForeignKey(a => a.TeamId)
                .OnDelete(DeleteBehavior.Restrict);
            
            modelBuilder.Entity<TeamPermission>()
                .HasOne(a => a.Team)
                .WithMany(a => a.TeamPermissions)
                .HasForeignKey(a => a.TeamId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
