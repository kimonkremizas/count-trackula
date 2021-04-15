using Microsoft.VisualStudio.TestTools.UnitTesting;
using CountTrackulaWebAPI.Controllers;
using System.Collections.Generic;
using CountTrackulaWebAPI.Model;
using System.Linq;

namespace WebAPIUnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void TestGetAllMethod()
        {
            DoorsTrackingController controller = new DoorsTrackingController();

            var list = controller.GetAll();

            Assert.AreEqual(typeof(List<DoorTracking>), list.GetType());
        }

        [TestMethod]
        public void TestGetCurrentOccupancyMethod()
        {
            DoorsTrackingController controller = new DoorsTrackingController();

            var door = controller.GetCurrentOccupancy();

            Assert.AreEqual(typeof(DoorTracking), door.GetType());
        }

        [TestMethod]
        public void TestGetCurrentOccupancyValueMethod()
        {
            DoorsTrackingController controller = new DoorsTrackingController();

            var door = controller.GetCurrentOccupancyValue();

            Assert.AreEqual(typeof(int), door.GetType());
        }

        [TestMethod]
        public void TestGetMethod()
        {
            DoorsTrackingController controller = new DoorsTrackingController();

            var door = controller.Get(2);

            Assert.AreEqual(typeof(DoorTracking), door.GetType());
        }

        [TestMethod]
        public void TestPutMethod()
        {
            var controller = new DoorsTrackingController();

            DoorTracking door = controller.Get(2);

            door.DateTime = new System.DateTime(2020, 12, 5, 00, 31, 39);

            controller.Put(2, door);

            DoorTracking doorPut = controller.Get(2);

            Assert.AreEqual(door.DateTime, doorPut.DateTime);

        }

        [TestMethod]
        public void TestDeleteMethod()
        {
            DoorsTrackingController controller = new DoorsTrackingController();

            controller.Delete(1);

            DoorTracking doorTrace = controller.Get(1);

            Assert.AreEqual(null, doorTrace);
        }

        [TestMethod]
        public void TestPostMethod()
        {
            DoorsTrackingController controller = new DoorsTrackingController();

            var door = new System.DateTime(2020, 12, 10, 20, 13, 50);

            DoorTracking postDoor = new DoorTracking(3480, door, 6, true);
            controller.Post(postDoor);
            DoorTracking doors = controller.Get(3480);

            Assert.AreEqual(true, doors.Equals(postDoor) != null);
        }

      
    }
}
