using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Finjector.Core.Domain
{
    public class CoaDetail
    {
        [Key]
        [MaxLength(128)]
        public string Id { get; set; } = string.Empty; //This is the segment string in the Coa table

        [MaxLength(3)]
        public string ChartType { get; set; } = string.Empty;

        [MaxLength(4)]
        public string Entity { get; set; } = string.Empty;
        [MaxLength(50)]
        public string EntityDetails { get; set; } = string.Empty;

        [MaxLength(5)]
        public string Fund { get; set; } = string.Empty;
        [MaxLength(50)]
        public string FundDetails { get; set; } = string.Empty;

        [MaxLength(7)]
        public string Department { get; set; } = string.Empty; //And PPM Org
        [MaxLength(50)]
        public string DepartmentDetails { get; set; } = string.Empty;

        [MaxLength(2)]
        public string Purpose { get; set; } = string.Empty;
        [MaxLength(50)]
        public string PurposeDetails { get; set; } = string.Empty;

        [MaxLength(6)]
        public string NaturalAccount { get; set; } = string.Empty; //And Expenditure Type
        [MaxLength(50)]
        public string NaturalAccountDetails { get; set; } = string.Empty;

        [MaxLength(10)]
        public string Project { get; set; } = string.Empty;
        [MaxLength(50)]
        public string ProjectDetails { get; set; } = string.Empty;

        [MaxLength(3)]
        public string Program { get; set; } = string.Empty;
        [MaxLength(50)]
        public string ProgramDetails { get; set; } = string.Empty;

        [MaxLength(6)]
        public string Activity { get; set; } = string.Empty;
        [MaxLength(50)]
        public string ActivityDetails { get; set; } = string.Empty;

        [MaxLength(6)]
        public string Task { get; set; } = string.Empty;
        [MaxLength(50)]
        public string TaskDetails { get; set; } = string.Empty;

        [JsonIgnore]
        public ICollection<Coa> Coas { get; set; } = new List<Coa>();

        internal static void OnModelCreating(ModelBuilder modelBuilder)
        {
            //CoaDetail can have many Coa's abd the Coa's have one CoaDetail with the segment string as the key
            modelBuilder.Entity<CoaDetail>()
                .HasMany(c => c.Coas)
                .WithOne(c => c.Detail)
                .HasForeignKey(c => c.SegmentString)
                .OnDelete(DeleteBehavior.SetNull);
        }

    }
}
