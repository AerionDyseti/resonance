using Microsoft.CSharp.RuntimeBinder;
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
    public class SimpleBooleanProperty_Tests
    {

        [TestMethod("constructor")]
        public void SimpleBooleanProperty_Constructor()
        {
            Assert.AreEqual("boolean", SimpleBooleanProperty.Type);

            var prop = new SimpleBooleanProperty("test", "Test Boolean");
            Assert.AreEqual("test", prop.Name, "name should match");
            Assert.AreEqual("Test Boolean", prop.DisplayName, "display name should match");
            Assert.IsNull(prop.Value, "value should be null");
            Assert.IsFalse(prop.HasValue, "hasValue should be false");

        }

        [TestMethod("static Type property")]
        public void SimpleBooleanProperty_Type()
        {
            Assert.AreEqual("boolean", SimpleBooleanProperty.Type, "static Type should be 'boolean'");
        }

        [TestMethod("Value setter")]
        public void SimpleBooleanProperty_Setter()
        {
            var prop = new SimpleBooleanProperty("test", "Test Boolean");
            prop.Value = true;
            Assert.AreEqual(true, prop.Value);
            prop.Value = false;
            Assert.AreEqual(false, prop.Value);
        }

        [TestMethod("Value setter - invalid")]
        [ExpectedException(typeof(RuntimeBinderException))]
        public void SimpleBooleanProperty_InvalidSetter()
        {
            var prop = new SimpleBooleanProperty("test", "Test Boolean");
            prop.Value = 42;
        }

        [TestMethod("HasValue")]
        public void SimpleBooleanProperty_HasValue()
        {
            var prop = new SimpleBooleanProperty("test", "Test Boolean");
            prop.Value = true;
            Assert.IsTrue(prop.HasValue);
            prop.Value = null;
            Assert.IsFalse(prop.HasValue);
        }
    }
}