namespace Resonance.Models.EntityProperties
{

    public class OptionProperty : BaseProperty<Option>
    {
        public OptionProperty(
            string name,
            string displayName,
            ISet<string> options
        ) : base(name, displayName)
        {
            Value = new Option()
            {
                Options = options ?? throw new ArgumentNullException(nameof(options)),
                Current = null
            };

        }

        public new static string Type => "option";

        public new bool HasValue => this.propValue!.Current != null;
    }
}