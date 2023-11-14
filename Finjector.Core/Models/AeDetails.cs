﻿

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
        public List<string> Errors { get; set; } = new List<string>();

    }

}
