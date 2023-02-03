using Resonance.Models.Shared;

namespace Resonance.Models.EntityProperties
{
    public interface IProperty : INamed
    {
        public static string Type { get; } = "unknown-type";
        public dynamic? Value { get; set; }
    }
}