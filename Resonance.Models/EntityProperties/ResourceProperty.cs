namespace Resonance.Models.EntityProperties
{
    public class Resource
    {
        public int? Minimum { get; set; }
        public int? Maximum { get; set; }
        public int? Current { get; set; }
    }

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

        public override bool HasValue => this.propValue?.Current != null;
    }
}