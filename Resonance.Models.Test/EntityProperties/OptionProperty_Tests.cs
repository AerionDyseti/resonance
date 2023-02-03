using Microsoft.VisualStudio.TestTools.UnitTesting;
using Resonance.Models.EntityProperties;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Resonance.Models.EntityProperties.Test
{
    [TestClass()]
    public class OptionProperty_Tests
    {
        readonly List<string> validOptions = new() { "a", "b", "c" };


        [TestMethod()]
        [ExpectedException(typeof(ArgumentNullException), "should throw exception if given null options")]
        public void OptionProprty_Constructor_BadArguments()
        {
            new OptionProperty("test", "Test without Options", null);
        }

        [TestMethod()]
        public void OptionProperty_Constructor_Instance()
        {
            Assert.AreEqual("option", OptionProperty.Type);

            var prop = new OptionProperty("test", "Test Options", validOptions);

            var propValue = prop.Value as Option;
            Assert.IsNotNull(propValue, "dynamic property casts correctly.");
            
            for (var i = 0; i < validOptions.Count; i++)
            {
                Assert.AreEqual(
                    validOptions[i],
                    propValue.Options.ElementAt(i),
                    $"option {i} is correct"
                );
            }
            
            Assert.IsNull(prop.Value!.Current, "value.Current is null");
        }
    }
}