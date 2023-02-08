using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Resonance.Models.Traits
{
    public class BaseTrait<T> : ITrait
    {
        public string Name { get;set; }
        public string Description { get;set; }

        public TraitType Type
        {
            get
            {
                switch(typeof(T))
                {
                    case int:
                        return TraitType.Number;
                        break;
                    default:
                        return TraitType.Unknown;
                }
            }
        }
    }
}
