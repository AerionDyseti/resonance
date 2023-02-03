using Resonance.Models.EntityProperties;
using Resonance.Models.Shared;

namespace Resonance.Models
{
    public class PropertyGroup : INamed
    {
        public string Name { get; set; } = "unknown-prop-group";
        public string DisplayName { get; set; } = "Unknown Property Group";
        public NamedList<IProperty> Properties { get; set; } = new NamedList<IProperty>();
    }
}