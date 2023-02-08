namespace Resonance.Models.EntityProperties
{
    public class Option
    {
        private string? current;

        public ISet<string> Options { get; set; } = new HashSet<string>(StringComparer.Ordinal);

        public string? Current
        {
            get => current;
            set
            {
                if (value is null || Options.Contains(value))
                {
                    current = value;
                    return;
                }
                throw new InvalidOperationException(
                    "value must be one of the options in the options list"
                );
            }
        }
    }
}