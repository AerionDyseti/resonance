using Microsoft.CSharp.RuntimeBinder;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Resonance.Models.EntityProperties.Test
{
    [TestClass()]
    public class SimpleTextProperty_Tests
    {
        [TestMethod("static Type property")]
        public void SimpleTextProperty_Type()
        {
            Assert.AreEqual("text", SimpleTextProperty.Type);
        }

        [TestMethod("constructor")]
        public void SimpleTextProperty_Constructor()
        {
            var prop = new SimpleTextProperty("test", "Test");
            Assert.AreEqual("test", prop.Name);
            Assert.AreEqual("Test", prop.DisplayName);
            Assert.IsNull(prop.Value);
        }

        [TestMethod("Value setter")]
        public void SimpleTextProperty_ValueSetter()
        {
            var prop = new SimpleTextProperty("test", "Test");
            prop.Value = "beep boop";
            Assert.AreEqual("beep boop", prop.Value);
        }

        [TestMethod("Value setter - invalid")]
        [ExpectedException(typeof(RuntimeBinderException))]
        public void SimpleTextProperty_InvalidValueSetter()
        {
            var prop = new SimpleTextProperty("test", "Test");
            prop.Value = 42;
        }

        [TestMethod("HasValue")]
        public void SimpleTextProperty_HasValue()
        {
            var prop = new SimpleTextProperty("test", "Test");
            prop.Value = "beep boop";
            Assert.IsTrue(prop.HasValue);
            prop.Value = null;
            Assert.IsFalse(prop.HasValue);
        }
    }
}