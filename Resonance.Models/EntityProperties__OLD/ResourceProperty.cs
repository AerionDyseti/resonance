namespace Resonance.Models.EntityProperties
{

    public class ResourceProperty : BaseProperty<Resource>
    {
        public ResourceProperty(string name, string displayName) : base(name, displayName)
        {
            Value = new Resource()
            {
                Minimum = null,
                Maximum = null,
                Current = null
            };
        }

        public new static string Type => "resource";

        public override bool HasValue => this.propValue!.Current != null;
    }
}