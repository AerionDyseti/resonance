namespace Resonance.Models.EntityProperties
{
    public class NumberProperty : BaseProperty<int?>
    {
        public NumberProperty(string name, string displayName) : base(name, displayName)
        {
        }

        public new static string Type => "number";
    }
}