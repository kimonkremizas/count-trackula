using Microsoft.VisualStudio.TestTools.UnitTesting;
using CountTrackulaWebAPI.Controllers;
using System.Collections.Generic;
using CountTrackulaWebAPI.Model;

namespace WebAPIUnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestGetMethod()
        {
            DoorsTrackingController controller = new DoorsTrackingController();

            var list = controller.GetAll();

            Assert.AreEqual(typeof(List<DoorTracking>), list.GetType());
        }

        [TestMethod]
        public void TestGetSpecificMethod()
        {
            DoorsTrackingController controller = new DoorsTrackingController();

            var doorTrace = controller.Get(1);

            Assert.AreEqual(typeof(DoorTracking), doorTrace.GetType());

        }

        [TestMethod]
        public void TestDeleteMethod()
        {
            DoorsTrackingController controller = new DoorsTrackingController();

            controller.Delete(1);

            DoorTracking doorTrace = controller.Get(1);

            Assert.AreEqual(null, doorTrace);
        }
    }
}
