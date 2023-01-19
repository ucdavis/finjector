using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Finjector.Web.Models
{
    public class ChartViewModel
    {
        [StringLength(36)]
        public string Id { get; set; } = "";
        [StringLength(128)]
        public string SegmentString { get; set; } = "";
        [StringLength(200)]
        public string DisplayName { get; set; } = "";
        [StringLength(3)]
        public string ChartType { get; set; } = "";
    }
}
