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
    public class NumberProperty_Tests
    {
        [TestMethod("Ctor() Creates correct Instance")]
        public void NumberProperty_Constructor_Instance()
        {
            Assert.AreEqual("number", NumberProperty.Type);

        }

        [TestMethod("Constructor")]
        public void NumberProperty_Constructor()
        {
            var prop = new NumberProperty("test", "Test");
            Assert.AreEqual("test", prop.Name);
            Assert.AreEqual("Test Number", prop.DisplayName);
            Assert.IsNull(prop.Value);
            Assert.IsFalse(prop.HasValue);

        }

        [TestMethod("Value Setters")]
        public void NumberProperty_Setter()
        {
            var prop = new NumberProperty("test", "Test");
            prop.Value = 42;
            Assert.AreEqual(42, prop.Value);
        }

        [TestMethod("HasValue")]
        public void NumberProperty_HasValue()
        {
            var prop = new NumberProperty("test", "Test");
            prop.Value = 42;
            Assert.IsTrue(prop.HasValue);
            prop.Value = null;
            Assert.IsFalse(prop.HasValue);
        }
    }
}