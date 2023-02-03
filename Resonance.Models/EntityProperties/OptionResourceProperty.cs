namespace Resonance.Models.EntityProperties
{
    public class OptionResource
    {
        public IEnumerable<string> Options {get;set; } = new List<string>();
        public IEnumerable<string>? Values {get;set; }
        public int? Minimum { get; set; }
        public int? Maximum { get; set; }
    }
    public class OptionResourceProperty : BaseProperty<OptionResource>
    {
        public OptionResourceProperty(string name, string displayName) : base(name, displayName)
        {
        }

        public new static string Type => "options-resource";
    }
}
