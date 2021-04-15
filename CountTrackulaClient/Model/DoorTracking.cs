using System;
using System.Collections.Generic;
using System.Text;

namespace CountTrackulaClient.Model
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

        public DoorTracking(int id, DateTime dateTime, int occupancy, bool isEntrance)
        {
            Id = id;
            DateTime = dateTime;
            Occupancy = occupancy;
            IsEntrance = isEntrance;
        }

        public DoorTracking(DateTime dateTime, int occupancy, bool isEntrance)
        {
            this.Id = 0;
            this.DateTime = dateTime;
            this.Occupancy = occupancy;
            this.IsEntrance = isEntrance;
        }
    }
}