namespace Resonance.Models.EntityProperties
{
    public class BooleanProperty : BaseProperty<bool?>
    {
        public BooleanProperty(string name, string displayName) : base(name, displayName)
        { }

        public new static string Type => "boolean";
    }
}