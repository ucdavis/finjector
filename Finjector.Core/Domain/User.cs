using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Finjector.Core.Domain
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(10)]
        public string Iam { get; set; } = string.Empty;

        [MaxLength(20)]
        public string Kerberos { get; set; } = string.Empty;

        [Required]
        [MaxLength(300)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;


        //Maybe don't have name info?
        [Required]
        [MaxLength(50)]
        [Display(Name = "First Name")]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        [Display(Name = "Last Name")]
        public string LastName { get; set; } = string.Empty;


        [Display(Name = "Name")]
        public string Name => FirstName + " " + LastName;

        internal static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Team>()
                .HasOne(a => a.Owner)
                .WithMany()
                .HasForeignKey(a => a.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
