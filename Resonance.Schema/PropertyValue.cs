using Resonance.Schema.Properties;

namespace Resonance.Schema
{
    public class PropertyValue<T>
    {
        public IProperty<T> Property { get; init; }
        public T Value { get; set; }

        public PropertyValue(IProperty<T> propertyType, T value)
        {
            Property = propertyType;
            Value = value;
        }
    }
}
