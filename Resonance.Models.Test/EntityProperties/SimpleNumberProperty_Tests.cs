using Microsoft.CSharp.RuntimeBinder;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Resonance.Models.EntityProperties.Test
{
    [TestClass()]
    public class SimpleNumberProperty_Tests
    {
        [TestMethod("static Type property")]
        public void NumberProperty_Type()
        {
            Assert.AreEqual("number", SimpleNumberProperty.Type);
        }

        [TestMethod("constructor")]
        public void NumberProperty_Constructor()
        {
            var prop = new SimpleNumberProperty("test", "Test");
            Assert.AreEqual("test", prop.Name);
            Assert.AreEqual("Test", prop.DisplayName);
            Assert.IsNull(prop.Value);
        }

        [TestMethod("Value setter")]
        public void NumberProperty_ValueSetter()
        {
            var prop = new SimpleNumberProperty("test", "Test");
            prop.Value = 42;
            Assert.AreEqual(42, prop.Value);
        }

        [TestMethod("Value setter - invalid")]
        [ExpectedException(typeof(RuntimeBinderException))]
        public void NumberProperty_InvalidValueSetter()
        {
            var prop = new SimpleNumberProperty("test", "Test");
            prop.Value = "beep boop";
        }

        [TestMethod("HasValue")]
        public void NumberProperty_HasValue()
        {
            var prop = new SimpleNumberProperty("test", "Test");
            prop.Value = 42;
            Assert.IsTrue(prop.HasValue);
            prop.Value = null;
            Assert.IsFalse(prop.HasValue);
        }
    }
}