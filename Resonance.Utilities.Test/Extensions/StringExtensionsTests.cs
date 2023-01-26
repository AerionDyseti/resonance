using Resonance.Utilities.Extensions;

namespace Resonance.Utilities.Test.Extensions
{
    [TestClass()]
    public class StringExtensionsTests
    {
        [TestMethod()]
        public void ToSnakeCasingTest()
        {
            var testStr = "test string";
            Assert.AreEqual("test_string", testStr.ToSnakeCasing(), "handles basic string");

            testStr = "CAPITAL TEST";
            Assert.AreEqual("capital_test", testStr.ToSnakeCasing(), "handles capitals string");

            testStr = "NUM!@#123*()TEST";
            Assert.AreEqual("num_123_test", testStr.ToSnakeCasing(), "handles non-alphanumeric");
        }
    }
}