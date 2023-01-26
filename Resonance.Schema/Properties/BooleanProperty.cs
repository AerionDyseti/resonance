namespace Resonance.Schema.Properties
{
    public class BooleanProperty : INamed, IValueProperty<bool>
    {
        public BooleanProperty(string name, string displayName)
        {
            Name = name;
            DisplayName = displayName;
        }

        public string Name { get; init; } = "UNKNOWN";
        public string DisplayName { get; init; } = "Unknown Tag Property";
        public PropertyType Type => PropertyType.Tag;
        public bool Value { get; set; }
    }
}