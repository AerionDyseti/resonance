namespace Resonance.Schema.Properties
{
    public class TextProperty : INamed, IProperty<string>
    {
        public TextProperty(string name, string displayName)
        {
            Name = name;
            DisplayName = displayName;
        }

        public string Name { get; init; } = "UNKNOWN";
        public string DisplayName { get; init; } = "Unknown Text Property";
        public PropertyType Type => PropertyType.Text;
    }
}