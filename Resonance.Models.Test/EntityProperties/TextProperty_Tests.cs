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
    public class TextProperty_Tests
    {
        [TestMethod()]
        public void TextProperty_Constructor_Instance()
        {
            Assert.AreEqual("text", TextProperty.Type);

            var prop = new TextProperty("test", "Test Text");
            Assert.AreEqual("test", prop.Name);
            Assert.AreEqual("Test Text", prop.DisplayName);
            Assert.IsNull(prop.Value);
        }
    }
}