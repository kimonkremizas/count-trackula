using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using CountTrackulaClient.Model;
using Newtonsoft.Json;

namespace CountTrackulaClient.Controllers
{
    public class TaskController
    {
        private const string DoorsTrackingUri = "https://counttrackulawebapi.azurewebsites.net/api/DoorsTracking";
        //private const string DoorsTrackingUri = "https://localhost:44371/api/DoorsTracking";

        public TaskController()
        {
        }

        public static async Task<IList<DoorTracking>> GetDoorTrackingAsync()
        {
            using (HttpClient client = new HttpClient())
            {
                string content = await client.GetStringAsync(DoorsTrackingUri);
                IList<DoorTracking> bList = JsonConvert.DeserializeObject<IList<DoorTracking>>(content);
                return bList;
            }
        }

        public static async Task<DoorTracking> GetOneDoorTrackingAsync(int id)
        {
            string requestUri = DoorsTrackingUri + "/" + id;
            using (HttpClient client = new HttpClient())
            {
                string content = await client.GetStringAsync(requestUri);
                DoorTracking b = JsonConvert.DeserializeObject<DoorTracking>(content);
                return b;
            }
        }

        public static async Task<DoorTracking> GetOneDoorTrackingAsync1(int id)
        {
            string requestUri = DoorsTrackingUri + "/" + id;
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage response = await client.GetAsync(requestUri);
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    throw new Exception("DoorTracking not found. Try another id");

                }

                response.EnsureSuccessStatusCode();
                string str = await response.Content.ReadAsStringAsync();
                DoorTracking b = JsonConvert.DeserializeObject<DoorTracking>(str);
                return b;
            }
        }


        public static async Task<int> GetLastDoorTrackingAsync()
        {
            string requestUri = DoorsTrackingUri + "/GetCurrentOccupancyValue";
            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage response = await client.GetAsync(requestUri);
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    throw new Exception("DoorTracking not found. Try another id");

                }

                response.EnsureSuccessStatusCode();
                string str = await response.Content.ReadAsStringAsync();
                int b = JsonConvert.DeserializeObject<int>(str);
                return b;
            }
        }


        public static async Task<DoorTracking> DeleteOneDoorTrackingAsync(int id)
        {
            string requestUri = DoorsTrackingUri + "/" + id;

            using (HttpClient client = new HttpClient())
            {
                HttpResponseMessage response = await client.DeleteAsync(requestUri);
                Console.WriteLine("StatusCode" + response.StatusCode);
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    throw new Exception("DoorTracking not found or DoorTracking is persistent. Try another id");

                }

                response.EnsureSuccessStatusCode();
                string str = await response.Content.ReadAsStringAsync();
                DoorTracking deletedDoorTracking = JsonConvert.DeserializeObject<DoorTracking>(str);
                return deletedDoorTracking;
            }
        }


        public static async Task<DoorTracking> AddDoorTrackingAsync(DoorTracking newDoorTracking)
        {
            using (HttpClient client = new HttpClient())
            {
                var jsonString = JsonConvert.SerializeObject(newDoorTracking);
                Console.WriteLine("JSON: " + jsonString);
                StringContent content = new StringContent(jsonString, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PostAsync(DoorsTrackingUri, content);
                if (response.StatusCode == HttpStatusCode.Conflict)
                {
                    throw new Exception("DoorTracking already exists. Try another id");
                }

                response.EnsureSuccessStatusCode();
                string str = await response.Content.ReadAsStringAsync();
                DoorTracking copyOfNewDoorTracking = JsonConvert.DeserializeObject<DoorTracking>(str);
                return copyOfNewDoorTracking;
            }
        }

        public static async Task<DoorTracking> UpdateDoorTrackingAsync(DoorTracking newDoorTracking, int id)
        {
            using (HttpClient client = new HttpClient())
            {
                string requestUri = DoorsTrackingUri + "/" + id;
                var jsonString = JsonConvert.SerializeObject(newDoorTracking);
                Console.WriteLine("JSON: " + jsonString);
                StringContent content = new StringContent(jsonString, Encoding.UTF8, "application/json");

                HttpResponseMessage response = await client.PutAsync(requestUri, content);
                if (response.StatusCode == HttpStatusCode.NotFound)
                {
                    throw new Exception("DoorTracking not found. Try another id");
                }

                string str = await response.Content.ReadAsStringAsync();
                DoorTracking updateDoorTracking = JsonConvert.DeserializeObject<DoorTracking>(str);
                return updateDoorTracking;
            }
        }
    }
}
