namespace Resonance.Models.EntityProperties
{
    public class SimpleTextProperty : BaseProperty<string>
    {
        public SimpleTextProperty(string name, string displayName) : base(name, displayName)
        {
        }

        public new static string Type => "text";
    }
}