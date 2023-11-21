using AggieEnterpriseApi.Validation;
using Finjector.Core.Domain;

namespace Finjector.Core.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        /// Trim and Replace spaces with %
        /// The contains query in Aggie Enterprise accepts % 
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static string ToFuzzyQuery(this string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            return value.Trim().Replace(" ", "%");
        }

        public static string ToUpperTrim(this string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return string.Empty;
            }

            return value.Trim().ToUpper();
        }

        /// <summary>
        /// Return segmented detail values from a CoA string
        /// </summary>
        /// <param name="value">Should be either a PPM or GL string</param>
        /// <returns></returns>
        public static CoaDetail ToCoADetail(this string value)
        {
            var chartType = FinancialChartValidation.GetFinancialChartStringType(value);

            if (chartType == FinancialChartStringType.Invalid)
            {
                return new CoaDetail();
            }
            
            var rtValue = new CoaDetail()
            {
                Id = value,
                ChartType = chartType == FinancialChartStringType.Ppm ? Coa.ChartTypes.PPM : Coa.ChartTypes.GL
            };
            
            if (chartType == FinancialChartStringType.Ppm)
            {
                var parts = value.Split('-');
                rtValue.Project        = parts[0];
                rtValue.Task           = parts[1];
                rtValue.Department     = parts[2];
                rtValue.NaturalAccount = parts[3];
            }
            if (chartType == FinancialChartStringType.Gl)
            {
                var parts = value.Split('-');
                rtValue.Entity         = parts[0];
                rtValue.Fund           = parts[1];
                rtValue.Department     = parts[2];
                rtValue.NaturalAccount = parts[3];
                rtValue.Purpose        = parts[4];
                rtValue.Program        = parts[5];
                rtValue.Project        = parts[6];
                rtValue.Activity       = parts[7];
            }

            return rtValue;
        }
    }
}
