namespace Resonance.Models.EntityProperties
{
    public class TextProperty : BaseProperty<string>
    {
        public TextProperty(string name, string displayName) : base(name, displayName)
        {
        }

        public new static string Type => "text";
    }
}