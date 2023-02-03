using Resonance.Models.EntityProperties;
using Resonance.Models.Shared;

namespace Resonance.Models
{
    public class Entity
    {
        public string Name { get; init; } = "unknown-entity";
        public string DisplayName { get; init; } = "Unknown Entity";
        public NamedList<IProperty> Properties { get; init; } = new NamedList<IProperty>();
        public NamedList<PropertyGroup> Groups { get; init; } = new NamedList<PropertyGroup>();
    }
}