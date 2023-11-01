using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Finjector.Core.Domain
{
    public class Coa
    {
        [Key]
        public int Id { get; set; }

        public int FolderId { get; set; }
        public Folder Folder { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        [Display(Name = "Name")]
        public string Name { get; set; } = string.Empty;

        [Required]
        [MaxLength(80)] //Actually 70 I think, but a little play...
        public string Coa { get; set; }

        [MaxLength(3)]
        public string ChartType { get; set; } = string.Empty;
    }
}
