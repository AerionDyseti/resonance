namespace Resonance.Schema.Properties
{
    public interface IValueArrayProperty<T> : IProperty
    {
        public IList<T> Value { get; }
    }
}