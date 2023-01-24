using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Finjector.Core.Models;

public class Chart
{
    [StringLength(36)]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    [StringLength(10)]
    public string IamId { get; set; } = "";
    [StringLength(128)]
    public string SegmentString { get; set; } = "";
    [StringLength(200)]
    public string DisplayName { get; set; } = "";
    [StringLength(3)]
    public string ChartType { get; set; } = "";
}


