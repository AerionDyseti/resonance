using System.Text.RegularExpressions;

namespace Resonance.Utilities.Extensions
{
    public static class StringExtensions
    {
        /// <summary>
        /// Converts a given name (usually the Display Name)
        /// into Snake Casing.
        /// </summary>
        /// <param name="str">The string to convert.</param>
        /// <returns>
        /// A string with the same value, but in Snake Casing.
        /// </returns>
        public static string ToSnakeCasing(this string str)
        {
            var words = new Regex("[^A-Za-z0-9]")
                .Split(str)
                .Select(word => word.Trim().ToLower())
                .Where(word => word.Length > 0);

            return string.Join('_', words);
        }
    }
}