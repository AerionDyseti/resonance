using Resonance.Models.Shared;

namespace Resonance.Models.EntityProperties
{
    public interface IProperty<T> : INamed
    {
        public static string Type { get; } = "unknown-type";
        public T? Value { get; set; }
    }
}