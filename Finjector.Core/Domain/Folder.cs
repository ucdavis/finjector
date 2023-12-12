using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Finjector.Core.Domain
{
    public class Folder
    {
        [Key]
        public int Id { get; set; }

        public int TeamId { get; set; }
        [Required]
        public Team Team { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        [Display(Name = "Folder Name")]
        public string Name { get; set; } = string.Empty;

        [MaxLength(300)]
        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;

        public bool IsDefault { get; set; } = false;

        [JsonIgnore]
        public List<Coa> Coas { get; set; } = new List<Coa>();
        
        [JsonIgnore]
        public List<FolderPermission> FolderPermissions { get; set; } = new List<FolderPermission>();

        [NotMapped]
        public static string DefaultFolderName = "Default";
        
        internal static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Folder>().HasQueryFilter(t => t.IsActive);

            modelBuilder.Entity<Coa>()
                .HasOne(a => a.Folder)
                .WithMany(a => a.Coas)
                .HasForeignKey(a => a.FolderId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<FolderPermission>()
                .HasOne(a => a.Folder)
                .WithMany(a => a.FolderPermissions)
                .HasForeignKey(a => a.FolderId)
                .OnDelete(DeleteBehavior.Restrict);

        }
    }
}
