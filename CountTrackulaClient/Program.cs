using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Resources;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using CountTrackulaClient.Controllers;
using CountTrackulaClient.Model;

namespace CountTrackulaClient
{
    internal class Program
    {
        // Specify the Port used
        private const int Port = 57054;
        // Initialize dateTimeLine variable
        static string dateTimeLine = "";
        // Initialize isEntranceLine variable
        static string isEntranceLine = "";


        /// <summary>
        /// Method that truncates given datetime to given precision
        /// </summary>
        /// <param name="dateTime"> Timestamp you want to truncate </param>
        /// <param name="timeSpan"> Precision </param>
        /// <returns></returns>
        public static DateTime Truncate(DateTime dateTime, TimeSpan timeSpan)
        {
            if (timeSpan == TimeSpan.Zero) return dateTime; // Or could throw an ArgumentException
            if (dateTime == DateTime.MinValue || dateTime == DateTime.MaxValue) return dateTime; // do not modify "guard" values
            return dateTime.AddTicks(-(dateTime.Ticks % timeSpan.Ticks));
        }

        /// <summary>
        /// Method that creates a new DB row which resets Occupancy to zero when called.
        /// </summary>
        public static async void ResetCounter()
        {
            var dateTimeNow = DateTime.Now;
            dateTimeNow = Truncate(dateTimeNow,TimeSpan.FromMilliseconds(10));



            // Create new DoorTracking object with the newly created properties
            DoorTracking resetDoorTracking = new DoorTracking(dateTimeNow, 0, false);
            // This object is the result of the HTTP POST method that is used in this very line
            DoorTracking doorTracking = await TaskController.AddDoorTrackingAsync(resetDoorTracking);
        }


        /// <summary>
        /// Main method that receives broadcast UDP messages and creates new DoorTracking object
        /// </summary>
        /// <param name="args"></param>
        static void Main(string[] args)
        {
            // Create a socket
            using (UdpClient socket = new UdpClient(new IPEndPoint(IPAddress.Any, Port)))
            {
                // Listen to all IPs and ports in the network
                IPEndPoint remoteEndPoint = new IPEndPoint(0, 0);
                // RESET TIMER
                var DailyTime = "00:00:00";
                var timePartsFirstRun = DailyTime.Split(new char[1] { ':' });
                var dateFirstRun = DateTime.Now;
                var nextTaskExecutionDate = new DateTime(dateFirstRun.Year, dateFirstRun.Month, dateFirstRun.Day,
                    int.Parse(timePartsFirstRun[0]), int.Parse(timePartsFirstRun[1]), int.Parse(timePartsFirstRun[2]));
                bool shouldIssueTaskToday = true;

                while (true)
                { 
                    var dateNow = DateTime.Now;
                    if (shouldIssueTaskToday)
                    { 
                        if (nextTaskExecutionDate > dateNow)
                        {
                            TimeSpan ts = nextTaskExecutionDate - dateNow;
                            //waits certain time and run the code
                            Task.Delay(ts).ContinueWith((x) => ResetCounter());
                            shouldIssueTaskToday = false;
                        }
                    }
                    else if (nextTaskExecutionDate.Day != dateNow.Day)
                    {
                        nextTaskExecutionDate = nextTaskExecutionDate.AddDays(1);
                        shouldIssueTaskToday = true;
                    }

                    // Listen to Broadcast
                    Console.WriteLine("Waiting for broadcast {0}", socket.Client.LocalEndPoint);
                    byte[] datagramReceived = socket.Receive(ref remoteEndPoint);
                    string message = Encoding.ASCII.GetString(datagramReceived, 0, datagramReceived.Length);
                    Console.WriteLine("Receives {0} bytes from {1} port {2} message {3}", datagramReceived.Length,
                        remoteEndPoint.Address, remoteEndPoint.Port, message);
                    // Call Parse function that splits received message to parts
                    Parse(message);
                    Console.WriteLine(dateTimeLine);
                    Console.WriteLine(isEntranceLine);
                    // Convert string dateTimeLine message part to DateTime type
                    DateTime dateTime = DateTime.Parse(dateTimeLine);
                    bool isEntrance = true;
                    // Convert string isEntranceLine message part to boolean type
                    if (isEntranceLine == "1")
                    {
                        isEntrance = true;
                    }
                    else
                    {
                        isEntrance = false;
                    }
                    // Get last value of Occupancy column using HTTP GET method
                    int lastOccupancyValueValue = TaskController.GetLastDoorTrackingAsync().Result;
                    int occupancyValue = 0;
                    // Increase or decrease occupancyValue according to the value of isEntrance
                    if (isEntrance == true)
                    {
                        occupancyValue = lastOccupancyValueValue + 1;
                    }
                    else
                    {
                        // Prevent occupancyValue from becoming negative by assigning value of zero
                        if (lastOccupancyValueValue == 0)
                        {
                            occupancyValue = 0;
                        }
                        else
                        {
                            occupancyValue = lastOccupancyValueValue - 1;
                        }
                        
                    }
                    // Create new DoorTracking object with the newly created properties
                    DoorTracking newDoorTracking = new DoorTracking(dateTime, occupancyValue, isEntrance);
                    // This object is the result of the HTTP POST method that is used in this very line
                    DoorTracking doorTracking = TaskController.AddDoorTrackingAsync(newDoorTracking).Result;
                }
            }
        }
        /// <summary>
        /// Method that splits the response string to multiple parts that are saved in variables using the specified separator
        /// </summary>
        /// <param name="response"></param>
        private static void Parse(string response)
        {
            // Here we split the message using the specified separator to a new array of type string
            string[] parts = response.Split(',');
            // Save first element of the array into a new variable
            dateTimeLine = parts[0];
            // Save second element of the array into a new variable
            isEntranceLine = parts[1];
            // Check the result of Parse method
            Console.WriteLine(dateTimeLine + "+++" + isEntranceLine);
        }

    }
}
