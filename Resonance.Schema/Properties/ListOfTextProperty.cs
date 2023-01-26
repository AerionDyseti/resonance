namespace Resonance.Schema.Properties
{
    public class ListOfTextProperty : INamed, IValueArrayProperty<string>
    {
        public ListOfTextProperty(string name, string displayName)
        {
            Name = name;
            DisplayName = displayName;
        }

        public ListOfTextProperty(string name)
        {
        }

        public IList<string> Value { get; set; } = new List<string>();

        public PropertyType Type => PropertyType.ListOfText;

        public string Name { get; init; } = "UNKNOWN";
        public string DisplayName { get; init; } = "Unknown Text List Property";
    }
}