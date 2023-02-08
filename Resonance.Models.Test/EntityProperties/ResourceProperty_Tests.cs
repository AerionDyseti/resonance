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
    public class ResourceProperty_Tests
    {
        [TestMethod("static Type property")]
        public void ResourceProperty_Type()
        {
            Assert.AreEqual("resource", ResourceProperty.Type);
        }

        [TestMethod("constructor")]
        public void ResourceProperty_Constructor()
        {
            var prop = new ResourceProperty("test", "Test");
            Assert.AreEqual("test", prop.Name);
            Assert.AreEqual("Test", prop.DisplayName);
            var propValue = prop.Value as Resource;
            Assert.IsNotNull(propValue, "should cast to Resource");
            Assert.IsNull(propValue.Current);
        }

        [TestMethod("Value setter")]
        public void ResourceProperty_ValueSetter()
        {
            Assert.Fail();
        }

        [TestMethod("HasValue property")]
        public void ResourceProperty_HasValue()
        {
            Assert.Fail();
        }

        [TestMethod("Value setter - invalid")]
        public void ResourceProperty_InvalidValueSetter()
        {
            Assert.Fail();
        }
    }
}