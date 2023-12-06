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

    }
}
