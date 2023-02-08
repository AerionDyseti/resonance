using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Resonance.Models.EntityProperties
{
    public class TextListProperty : BaseProperty<IEnumerable<string>>
    {
        public TextListProperty(string name, string displayName) : base(name, displayName)
        {
        }

        public new static string Type => "text-list";
    }
}