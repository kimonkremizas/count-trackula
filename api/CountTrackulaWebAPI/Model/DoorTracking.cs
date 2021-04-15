using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CountTrackulaWebAPI.Model
{
    public class DoorTracking
    {

        public int Id { get; set; }
        public DateTime DateTime { get; set; }
        public int Occupancy { get; set; }
        public bool IsEntrance { get; set; }


        public DoorTracking()
            {

            }

        //public DoorTracking(DateTime dateTime, int occupancy)
        //{
        //    DateTime = dateTime;
        //    Occupancy = occupancy;
        //}

        public DoorTracking(int id, DateTime dateTime, int occupancy, bool isEntrance)
            {
                Id = id;
                DateTime = dateTime;
                Occupancy = occupancy;
                IsEntrance = isEntrance;
            }


    }
}
