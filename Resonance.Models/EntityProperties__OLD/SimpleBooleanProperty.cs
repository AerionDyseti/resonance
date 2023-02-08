namespace Resonance.Models.EntityProperties
{
    public class SimpleBooleanProperty : BaseProperty<bool?>
    {
        public SimpleBooleanProperty(string name, string displayName) : base(name, displayName)
        { }

        public new static string Type => "boolean";
    }
}