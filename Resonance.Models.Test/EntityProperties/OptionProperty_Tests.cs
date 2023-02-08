using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Resonance.Models.EntityProperties.Test
{
    [TestClass()]
    public class OptionProperty_Tests
    {
        readonly HashSet<string> validOptions = new() { "a", "b", "c" };

        [TestMethod("static Type property")]
        public void OptionProperty_Type()
        {
            Assert.AreEqual("option", OptionProperty.Type, "static Type should be 'option'");
        }

        [TestMethod("null options in constructor")]
        [ExpectedException(typeof(ArgumentNullException), "should throw exception if given null options")]
        public void OptionProprty_Constructor_BadArguments()
        {
            #pragma warning disable CS8625
            _ = new OptionProperty("test", "Test without Options", null);
            #pragma warning restore CS8625
        }

        [TestMethod("constructor")]
        public void OptionProperty_Constructor_Instance()
        {
            var prop = new OptionProperty("test", "Test Options", validOptions);
            var propValue = prop.Value as Option;
            Assert.IsNotNull(propValue, "dynamic property should cast as Option");
            Assert.IsTrue(propValue.Options.SetEquals(validOptions), "options should equal passed options");
            Assert.IsNull(prop.Value!.Current, "value.Current should be null");
        }

        [TestMethod("Value setter")]
        public void OptionProperty_ValueSetter()
        {
            var prop = new OptionProperty("test", "Test Options", validOptions);
            (prop.Value as Option)!.Current = "a";
        }

        [TestMethod("Value setter - invalid")]
        public void OptionProperty_InvalidValueSetter()
        {
            var prop = new OptionProperty("test", "Test Options", validOptions);
        }


        [TestMethod("HasValue")]
        public void OptionProperty_HasValue()
        {
            var prop = new OptionProperty("test", "Test Options", validOptions);
            Assert.IsFalse(prop.HasValue);
            (prop.Value as Option)!.Current = "a";
            Assert.IsTrue(prop.HasValue);
        }
    }
}