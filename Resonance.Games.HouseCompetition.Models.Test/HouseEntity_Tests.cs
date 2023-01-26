using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Resonance.Games.HouseCompetition.Models.Test
{
    [TestClass()]
    public class HouseEntity_Tests
    {
        [TestMethod()]
        public void Constructor_Test()
        {
            var houseEntity = new HouseEntity();
            Assert.IsNotNull(houseEntity);
            // TODO: More Testing.
        }
    }
}