using Resonance.Schema.Properties;

namespace Resonance.Schema
{
    public class PropertyGroup : INamed
    {
        public PropertyGroup(string name, string displayName)
        {
            Name = name;
            DisplayName = displayName;
        }

        public string Name { get; init; } = "UNKNOWN";
        public string DisplayName { get; init; } = "Unknown Property Group";
        public List<IProperty> Properties { get; init; } = new List<IProperty>();
    }
}