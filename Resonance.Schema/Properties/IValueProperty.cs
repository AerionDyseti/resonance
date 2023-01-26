namespace Resonance.Schema.Properties
{
    public interface IValueProperty<T> : IProperty
    {
        public T Value { get; set; }
    }
}