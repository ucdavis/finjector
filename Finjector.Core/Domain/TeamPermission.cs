using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Finjector.Core.Domain
{
    public class TeamPermission
    {
        [Key]
        public int Id { get; set; }

        public int TeamId { get; set; }
        [Required]
        public Team Team { get; set; } = null!;

        public int RoleId { get; set; }
        [Required]
        public Role Role { get; set; } = null!;

        public int UserId { get; set; }
        [Required]
        public User User { get; set;} = null!;

        internal static void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Nothing yet
        }
    }
}
