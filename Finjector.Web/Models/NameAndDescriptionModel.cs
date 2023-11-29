using System.ComponentModel.DataAnnotations;

namespace Finjector.Web.Models;

public class NameAndDescriptionModel
{
    [Required] [MaxLength(50)] public string Name { get; set; } = string.Empty;
    [MaxLength(300)] public string? Description { get; set; }
}