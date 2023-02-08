using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Resonance.Models.Traits
{
    public interface ITrait
    {
        /// <summary>
        /// The unique Name/ID of this trait.
        /// </summary>

        string Name { get; set; }

        /// <summary>
        /// What a UI should output for this trait.
        /// </summary>
        string Description { get; set; }

        /// <summary>
        /// The type of trait this is, which determines what kind, 
        /// if any, of additional data is associated with it.
        /// </summary>
        TraitType Type { get; }
    }
}
