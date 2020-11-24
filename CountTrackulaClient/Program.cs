using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using CountTrackulaClient.Controllers;
using CountTrackulaClient.Model;

namespace CountTrackulaClient
{
    internal class Program
    {
        private const int Port = 7000;
        static string dateTimeLine = "";
        static string isEntranceLine = "";

        static void Main(string[] args)
        {
            using (UdpClient socket = new UdpClient(new IPEndPoint(IPAddress.Any, Port)))
            {
                IPEndPoint remoteEndPoint = new IPEndPoint(0, 0);

                while (true)
                {
                    Console.WriteLine("Waiting for broadcast {0}", socket.Client.LocalEndPoint);
                    byte[] datagramReceived = socket.Receive(ref remoteEndPoint);
                    string message = Encoding.ASCII.GetString(datagramReceived, 0, datagramReceived.Length);
                    Console.WriteLine("Receives {0} bytes from {1} port {2} message {3}", datagramReceived.Length,
                        remoteEndPoint.Address, remoteEndPoint.Port, message);

                    Parse(message);
                    Console.WriteLine(dateTimeLine);
                    Console.WriteLine(isEntranceLine);
                    DateTime dateTime = DateTime.Parse(dateTimeLine);
                    bool isEntrance = true;
                    if (isEntranceLine == "1")
                    {
                        isEntrance = true;
                    }
                    else
                    {
                        isEntrance = false;
                    }
                    int lastOccupancyValueValue = TaskController.GetLastDoorTrackingAsync().Result;
                    int occupancyValue = 0;

                    if (isEntrance == true)
                    {
                        occupancyValue = lastOccupancyValueValue + 1;
                    }
                    else
                    {
                        if (lastOccupancyValueValue == 0)
                        {
                            occupancyValue = 0;
                        }
                        else
                        {
                            occupancyValue = lastOccupancyValueValue - 1;
                        }
                        
                    }

                    DoorTracking newDoorTracking = new DoorTracking(dateTime, occupancyValue, isEntrance);
                    DoorTracking doorTracking = TaskController.AddDoorTrackingAsync(newDoorTracking).Result;
                }
            }
        }

        private static void Parse(string response)
        {
            string[] parts = response.Split(',');
            foreach (string part in parts)
            {
                Console.WriteLine(part);
            }
            dateTimeLine = parts[0];
            isEntranceLine = parts[1];

            Console.WriteLine(dateTimeLine + "+++" + isEntranceLine);
        }

    }
}
