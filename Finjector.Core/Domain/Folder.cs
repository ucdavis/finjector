using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
    }
}
