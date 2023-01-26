namespace Resonance.Schema.Properties
{
    public class NumberProperty : INamed, IValueProperty<int>
    {
        public NumberProperty(string name, string displayName)
        {
            Name = name;
            DisplayName = displayName;
        }

        public string Name { get; init; } = "UNKNOWN";
        public string DisplayName { get; init; } = "Unknown Number Property";
        public PropertyType Type => PropertyType.Number;
        public int Value { get; set; }
    }
}