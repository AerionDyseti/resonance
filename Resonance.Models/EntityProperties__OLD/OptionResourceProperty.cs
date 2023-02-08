namespace Resonance.Models.EntityProperties
{
    public class OptionResourceProperty : BaseProperty<OptionResource>
    {
        public OptionResourceProperty(string name, string displayName) : base(name, displayName)
        {
        }

        public new static string Type => "options-resource";
    }
}
