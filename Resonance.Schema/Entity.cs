using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Resonance.Schema.Properties;

namespace Resonance.Schema
{
    public class Entity
    {
        public ISchema Schema {get;set; }
        public List<PropertyValue> PropertyValues {get;set;}
    }
}
