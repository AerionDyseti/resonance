using System.Transactions;

namespace Resonance.Models.EntityProperties
{
    public class Option
    {
        public IEnumerable<string> Options { get; set; } = new List<string>();
        public string? Current { get; set; }
    }

    public class OptionProperty : BaseProperty<Option>
    {
        public OptionProperty(
            string name, 
            string displayName, 
            IEnumerable<string> options
        ) : base(name, displayName)
        {
            this.Value = new Option()
            {
                Options = options ?? throw new ArgumentNullException(nameof(options)),
                Current = null
            };

        }

        public new static string Type => "option";
    }
}