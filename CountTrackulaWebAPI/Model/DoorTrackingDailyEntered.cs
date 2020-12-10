using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CountTrackulaWebAPI.Model
{
    public class DoorTrackingDailyEntered
    {
        public string Day { get; set; }
        public int CustomersEntered { get; set; }



        public DoorTrackingDailyEntered()
        {

        }

        public DoorTrackingDailyEntered(string day, int customersEntered)
        {
            Day = day;
            CustomersEntered = customersEntered;
        }
    }
}
