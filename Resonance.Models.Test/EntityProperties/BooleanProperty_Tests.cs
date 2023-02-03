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
    public class BooleanProperty_Tests
    {
        [TestMethod("Constructor")]
        public void BooleanProperty_Constructor()
        {
            Assert.AreEqual("boolean", BooleanProperty.Type);

            var prop = new BooleanProperty("test", "Test Boolean");
            Assert.AreEqual("test", prop.Name, "name should match");
            Assert.AreEqual("Test Boolean", prop.DisplayName, "display name should match");
            Assert.IsNull(prop.Value, "value should be null");
            Assert.IsFalse(prop.HasValue, "hasValue should be false");

        }

        [TestMethod("Value Setters")]
        public void BooleanProperty_Setter()
        {
            var prop = new BooleanProperty("test", "Test Boolean");
            prop.Value = true;
            Assert.AreEqual(true, prop.Value);
            prop.Value = false;
            Assert.AreEqual(false, prop.Value);
        }

        [TestMethod("HasValue")]
        public void BooleanProperty_HasValue()
        {
            var prop = new BooleanProperty("test", "Test Boolean");
            prop.Value = true;
            Assert.IsTrue(prop.HasValue);
            prop.Value = null;
            Assert.IsFalse(prop.HasValue);
        }
    }
}