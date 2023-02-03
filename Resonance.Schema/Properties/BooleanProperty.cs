namespace Resonance.Schema.Properties
{
    public class BooleanProperty : INamed, IProperty<bool>
    {
        public BooleanProperty(string name, string displayName)
        {
            Name = name;
            DisplayName = displayName;
        }

        public string Name { get; init; } = "UNKNOWN";
        public string DisplayName { get; init; } = "Unknown Boolean Property";
        public PropertyType Type => PropertyType.Boolean;
    }
}