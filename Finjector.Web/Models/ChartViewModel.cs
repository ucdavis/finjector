using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Finjector.Web.Models
{
    public class ChartViewModel
    {
        public int Id { get; set; }
        [StringLength(128)]
        public string SegmentString { get; set; } = "";
        [StringLength(200)]
        public string Name { get; set; } = "";
        [StringLength(3)]
        public string ChartType { get; set; } = "";
        
        public int FolderId { get; set; }
    }
}
