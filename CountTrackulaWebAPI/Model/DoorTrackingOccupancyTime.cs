using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CountTrackulaWebAPI.Model
{
    public class DoorTrackingOccupancyTime
    {

        public DateTime DateTime { get; set; }
        public int Occupancy { get; set; }



        public DoorTrackingOccupancyTime()
        {

        }

        public DoorTrackingOccupancyTime(DateTime dateTime, int occupancy)
        {
            DateTime = dateTime;
            Occupancy = occupancy;
        }
    }
}
