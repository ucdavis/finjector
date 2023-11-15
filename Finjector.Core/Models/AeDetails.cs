

namespace Finjector.Core.Models
{
    public class AeDetails
    {
        public bool IsValid { get; set; } = true;
        public string ChartType { get; set; } = string.Empty;

        public string Error
        {
            get
            {
                if (Errors.Count <= 0)
                {
                    return string.Empty;
                }

                return string.Join(" ", Error);
            }
        }

        public string Warning
        {
            get
            {
                if (Warnings.Count <= 0)
                {
                    return string.Empty;
                }

                return string.Join(" ", Warnings);
            }
        }
        public List<string> Errors { get; set; } = new List<string>();
        public List<string> Warnings { get; set; } = new List<string>();

        public List<SegmentDetails> SegmentDetails { get; set; } = new List<SegmentDetails>();

        public List<Approver> Approvers { get; set; } = new List<Approver>();

        public Approver PpmProjectManager { get; set; } = new Approver();

    }

    public class SegmentDetails
    {
        public int Order { get; set; }
        public string Entity { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }

    public class Approver
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Name
        {
            get
            {
                return $"{LastName}, {FirstName}";
            }
        }
    }

}
