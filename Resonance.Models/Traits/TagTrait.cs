using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Resonance.Models.Traits
{
    /// <summary>
    /// The simple trait on an element, marking a trait as being true
    /// without adding any additional information.
    /// </summary>
    public class TagTrait : ITrait
    {
        public string Name { get; set; } = "unknown-tag";
        public string Description { get; set; } = "Unknown Tag Trait";
        public TraitType Type => TraitType.Tag;
    }
}
