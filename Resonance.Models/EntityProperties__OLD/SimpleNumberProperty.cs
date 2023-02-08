namespace Resonance.Models.EntityProperties
{
    public class SimpleNumberProperty : BaseProperty<int?>
    {
        public SimpleNumberProperty(string name, string displayName) : base(name, displayName)
        {
        }

        public new static string Type => "number";
    }
}