using Resonance.Models.Shared;

namespace Resonance.Models.EntityProperties
{
    public abstract class BaseProperty<T> : IProperty
    {
        protected T? propValue;

        protected BaseProperty(string name, string displayName)
        {
            Name = name ?? throw new ArgumentNullException(nameof(name));
            DisplayName = displayName ?? throw new ArgumentNullException(nameof(displayName));
            Value = null;
        }

        public static string Type => typeof(T).Name;
        public string Name { get; set; }
        public string DisplayName { get; set; }

        public dynamic? Value
        {
            get => propValue;
            set => propValue = value;
        }

        public T? AsType()
        {
            if (propValue == null)
            {
                return default;
            }
            return (T) Convert.ChangeType(propValue, typeof(T));
        }

        public virtual bool HasValue => propValue != null;
    }
}