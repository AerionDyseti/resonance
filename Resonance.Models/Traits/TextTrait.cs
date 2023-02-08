using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Resonance.Models.Traits
{
    /// <summary>
    /// A simple trait on an element consisting of a single string of text.
    /// </summary>
    public class TextTrait : ITrait
    {
        public string Name { get; set; } = "unknown-text";
        public string Description { get; set; } = "Unknown Text Trait";
        public TraitType Type => TraitType.Text;

        /// <summary>
        /// Thes string value of this trait.
        /// </summary>
        public string Value { get; set; } = "";
    }
}
