namespace Resonance.Models.Traits
{
    /// <summary>
    /// A simple trait on an element consisting of a single integer number.
    /// </summary>
    public class NumberTrait : ITrait
    {
        public string Name { get; set; } = "unknown-number";
        public string Description { get; set; } = "Unknown Number Trait";
        public TraitType Type => TraitType.Number;

        /// <summary>
        /// The integer value of this trait.
        /// </summary>
        public int Value { get; set; } = 0;

    }
}
