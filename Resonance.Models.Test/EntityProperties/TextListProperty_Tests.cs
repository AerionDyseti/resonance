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
    public class TextListProperty_Tests
    {
        [TestMethod()]
        public void TextListProperty_Test()
        {
                        Assert.AreEqual("resource", ResourceProperty.Type);

            var prop = new ResourceProperty("test", "Test Resource");

            var propValue = prop.Value as Resource;
            Assert.IsNotNull(propValue, "dynamic property should cast to Resource");
                       
            Assert.IsNull(propValue.Current, "value.Current should be null");
            Assert.IsNull(propValue.Minimum, "value.Minimum should be null");
            Assert.IsNull(propValue.Maximum, "value.Maximum should be null");
        }
    }
}