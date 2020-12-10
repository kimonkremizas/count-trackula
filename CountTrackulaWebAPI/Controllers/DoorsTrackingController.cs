using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CountTrackulaWebAPI.Model;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using Azure.Storage.Blobs;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CountTrackulaWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoorsTrackingController : ControllerBase
    {
        static string conn = "Server=tcp:3rdsemesterserver.database.windows.net,1433;Initial Catalog=CountTrackulaDB;Persist Security Info=False;User ID=werty89;Password=Machinehead1989;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
        //static string connStorage = "DefaultEndpointsProtocol=https;AccountName=counttrackula;AccountKey=gH+ZupWcZG77VaQLb23Pjt6t2z22b0G9xJ3MM5XFfILCn43M0+DIjT5aTPQS/cAVpLYHFyXIJcOGlhyHIxi4bg==;EndpointSuffix=core.windows.net";

        List<DoorTrackingOccupancyTime> OccupancyWithTimeList = new List<DoorTrackingOccupancyTime>();
        List<DoorTrackingDailyEntered> DailyEnteredList = new List<DoorTrackingDailyEntered>();
        List<DoorTracking> DoorTrackingList = new List<DoorTracking>();


        public string JsonHighchartsAreaConvert(List<DoorTrackingOccupancyTime> list)
        {
            string json = JsonSerializer.Serialize(list);
            string jsonConverted1 = json.Replace("{", "[");
            string jsonConverted2 = jsonConverted1.Replace("}", "]");
            string jsonConverted3 = jsonConverted2.Replace("\"DateTime\":", "");
            string jsonConverted = jsonConverted3.Replace("\",\"Occupancy\":", "Z\",");
            return jsonConverted;
        }

        public string JsonHighchartsHistogramConvert(List<DoorTrackingDailyEntered> list)
        {
            string json = JsonSerializer.Serialize(list);
            string jsonConverted1 = json.Replace("{", "[");
            string jsonConverted2 = jsonConverted1.Replace("}", "]");
            string jsonConverted3 = jsonConverted2.Replace("\"Day\":", "");
            string jsonConverted = jsonConverted3.Replace("\"CustomersEntered\":", "");
            return jsonConverted;
        }




        // GET: api/<DoorsTrackingController>
        [HttpGet(Name = "GetAll")]
        public IEnumerable<DoorTracking> GetAll()
        {
            string selectAll = "select id, dateTime, occupancy, isEntrance from DoorsTracking";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand selectCommand = new SqlCommand(selectAll, databaseConnection))
                {
                    using (SqlDataReader reader = selectCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            int id = reader.GetInt32(0);
                            DateTime dateTime = reader.GetDateTime(1);
                            int occupancy = reader.GetInt32(2);
                            bool isEntrance = reader.GetBoolean(3);


                            DoorTrackingList.Add(new DoorTracking(id, dateTime, occupancy,isEntrance));
                        }
                    }
                }
            }

            return DoorTrackingList;
        }

        // GET: api/<DoorsTrackingController>/GetAllToJson
        [HttpGet("GetAllToJson", Name = "GetAllToJson")]
        public string GetAllToJson()
        {
            string selectAll = "select dateTime, occupancy from DoorsTracking";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand selectCommand = new SqlCommand(selectAll, databaseConnection))
                {
                    using (SqlDataReader reader = selectCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            DateTime dateTime = reader.GetDateTime(0);
                            int occupancy = reader.GetInt32(1);
                            
                            OccupancyWithTimeList.Add(new DoorTrackingOccupancyTime(dateTime, occupancy));
                        }
                    }
                }
            }
            
            return JsonHighchartsAreaConvert(OccupancyWithTimeList);
        }

        // GET: api/<DoorsTrackingController>/GetTodayToJson
        [HttpGet("GetTodayToJson", Name = "GetTodayToJson")]
        public string GetTodayToJson()
        {
            string selectAll = "select dateTime, occupancy from DoorsTracking where cast(dateTime as Date) = cast(getdate() as Date)";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand selectCommand = new SqlCommand(selectAll, databaseConnection))
                {
                    using (SqlDataReader reader = selectCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            DateTime dateTime = reader.GetDateTime(0);
                            int occupancy = reader.GetInt32(1);

                            OccupancyWithTimeList.Add(new DoorTrackingOccupancyTime(dateTime, occupancy));
                        }
                    }
                }
            }

            return JsonHighchartsAreaConvert(OccupancyWithTimeList);
        }

        // GET: api/<DoorsTrackingController>/GetLastWeekToJson
        [HttpGet("GetLastWeekToJson", Name = "GetLastWeekToJson")]
        public string GetLastWeekToJson()
        {
            string selectAll = "select dateTime, occupancy from DoorsTracking where cast(dateTime as Date) >= DATEADD(DAY, -6, cast(getdate() as Date))";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand selectCommand = new SqlCommand(selectAll, databaseConnection))
                {
                    using (SqlDataReader reader = selectCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            DateTime dateTime = reader.GetDateTime(0);
                            int occupancy = reader.GetInt32(1);

                            OccupancyWithTimeList.Add(new DoorTrackingOccupancyTime(dateTime, occupancy));
                        }
                    }
                }
            }

            return JsonHighchartsAreaConvert(OccupancyWithTimeList);
        }

        // GET: api/<DoorsTrackingController>/GetLastMonthToJson
        [HttpGet("GetLastMonthToJson", Name = "GetLastMonthToJson")]
        public string GetLastMonthToJson()
        {
            string selectAll = "select dateTime, occupancy from DoorsTracking where cast(dateTime as Date) >= DATEADD(DAY, -29, cast(getdate() as Date))";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand selectCommand = new SqlCommand(selectAll, databaseConnection))
                {
                    using (SqlDataReader reader = selectCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            DateTime dateTime = reader.GetDateTime(0);
                            int occupancy = reader.GetInt32(1);

                            OccupancyWithTimeList.Add(new DoorTrackingOccupancyTime(dateTime, occupancy));
                        }
                    }
                }
            }

            return JsonHighchartsAreaConvert(OccupancyWithTimeList);
        }


        // GET: api/<DoorsTrackingController>/GetLastWeekEntranceToJson
        [HttpGet("GetLastWeekEntranceToJson", Name = "GetLastWeekEntranceToJson")]
        public string GetLastWeekEntranceToJson()
        {
            string selectAll = "select convert(varchar,cast(dateTime as Date),107) + ' ('+ DATENAME(WEEKDAY, cast(dateTime as Date)) + ')'as Day, count(id) as CustomersEntered from DoorsTracking where cast(dateTime as Date) >= DATEADD(DAY, -6, cast(getdate() as Date)) and IsEntrance=1 group by cast(dateTime as Date) order by Day";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand selectCommand = new SqlCommand(selectAll, databaseConnection))
                {
                    using (SqlDataReader reader = selectCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            string day = reader.GetString(0);
                            int customersEntered = reader.GetInt32(1);

                            DailyEnteredList.Add(new DoorTrackingDailyEntered(day, customersEntered));
                        }
                    }
                }
            }

            return JsonHighchartsHistogramConvert(DailyEnteredList);
        }




        // GET api/<DoorsTrackingController>/5
        [HttpGet("{id}", Name = "GetById")]
        public DoorTracking Get(int id)
        {
            string selectById = "select dateTime, occupancy, isEntrance from DoorsTracking where id = @id";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand selectCommand = new SqlCommand(selectById, databaseConnection))
                {
                    selectCommand.Parameters.AddWithValue("@id", id);

                    using (SqlDataReader reader = selectCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            DateTime dateTime = reader.GetDateTime(0);
                            int occupancy = reader.GetInt32(1);
                            bool isEntrance = reader.GetBoolean(2);

                            return new DoorTracking(id, dateTime, occupancy, isEntrance);

                        }
                    }
                }
            }
            return null;
        }

        // GET api/<DoorsTrackingController>/GetCurrentOccupancy
        [HttpGet("GetCurrentOccupancy", Name = "GetCurrentOccupancy")]
        public DoorTracking GetCurrentOccupancy()
        {
            string selectCurrentOccupancy = "SELECT TOP 1 id, datetime, occupancy, isentrance FROM DoorsTracking  ORDER BY id desc;";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand selectCommand = new SqlCommand(selectCurrentOccupancy, databaseConnection))
                {
                    
                    using (SqlDataReader reader = selectCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            int id = reader.GetInt32(0);
                            DateTime dateTime = reader.GetDateTime(1);
                            int occupancy = reader.GetInt32(2);
                            bool isEntrance = reader.GetBoolean(3);

                            return new DoorTracking(id, dateTime, occupancy, isEntrance);

                        }
                    }
                }
            }
            return null;
        }


        // GET api/<DoorsTrackingController>/GetCurrentOccupancyValue
        [HttpGet("GetCurrentOccupancyValue", Name = "GetCurrentOccupancyValue")]
        public int GetCurrentOccupancyValue()
        {
            string selectCurrentOccupancyValue = "SELECT TOP 1 occupancy FROM DoorsTracking  ORDER BY id desc;";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand selectCommand = new SqlCommand(selectCurrentOccupancyValue, databaseConnection))
                {

                    using (SqlDataReader reader = selectCommand.ExecuteReader())
                    {
                        while (reader.Read())
                        {

                            int occupancy = reader.GetInt32(0);


                            return occupancy;

                        }
                    }
                }
            }
            return 0;
        }



        // POST api/<DoorsTrackingController>
        [HttpPost]
        public DoorTracking Post([FromBody] DoorTracking value)
        {
            string insertString = "";
            string insertDoorTracking =
                "insert into DoorsTracking (id,dateTime,occupancy,isEntrance) values (@id,@dateTime,@occupancy,@isEntrance)";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand insertCommand = new SqlCommand(insertDoorTracking, databaseConnection))
                {
                    int newid = GetId();
                    insertCommand.Parameters.AddWithValue("@id", newid);
                    insertCommand.Parameters.AddWithValue("@dateTime", value.DateTime);
                    insertCommand.Parameters.AddWithValue("@occupancy", value.Occupancy);
                    insertCommand.Parameters.AddWithValue("@isEntrance", value.IsEntrance);
                    int rowsAffected = insertCommand.ExecuteNonQuery();
                    return new DoorTracking(newid, value.DateTime, value.Occupancy, value.IsEntrance);

                }

            }
        }

        //[HttpPost]
        //public async Task<IActionResult> Index([FromBody] JsonElement body)
        //{
        //    string json = System.Text.Json.JsonSerializer.Serialize(body);
        //    var size = json.Length * sizeof(Char);

        //    if (size < 20000)
        //    {
        //        string filePath = @"C:/Json";
        //        string fileName = @"CountTrackulaWebAPI.json";
        //        try
        //        {
        //            using (StreamWriter outputFile = new StreamWriter(Path.Combine(filePath, fileName)))
        //                await outputFile.WriteAsync(json);
        //            return Ok();
        //        }
        //        catch (Exception)
        //        {
        //            //INSERT LOGGING CODE HERE - TO CAPTURE THE EXCEPTION
        //            return BadRequest("Unspecified create error"); //Purposely being ambiguous or obfuscating the actual error and file path.
        //        }
        //    }
        //    else
        //        return BadRequest("Error: Malformed data sent.");
        //}




        // PUT api/<DoorsTrackingController>/5
        [HttpPut("{id}")]
        public string Put(int id, [FromBody] DoorTracking value)
        {
            string updateString = "";
            string updateDoorTracking = "update DoorsTracking set dateTime = @dateTime, occupancy = @occupancy, isEntrance = @isEntrance where id = @id";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand updateCommand = new SqlCommand(updateDoorTracking, databaseConnection))
                {
                    updateCommand.Parameters.AddWithValue("@id", id);
                    updateCommand.Parameters.AddWithValue("@dateTime", value.DateTime);
                    updateCommand.Parameters.AddWithValue("@occupancy", value.Occupancy);
                    updateCommand.Parameters.AddWithValue("@isEntrance", value.IsEntrance);
                    int rowsAffected = updateCommand.ExecuteNonQuery();
                    updateString = $"Row(s) affected: {rowsAffected}.\nDoorTracking with id {id} updated.";
                }
                return updateString;
            }
        }

        // DELETE api/<DoorsTrackingController>/5
        [HttpDelete("{id}")]
        public string Delete(int id)
        {
            string deleteString = "";
            string deleteDoorTracking = "delete from DoorsTracking where id = @id";

            using (SqlConnection databaseConnection = new SqlConnection(conn))
            {
                databaseConnection.Open();
                using (SqlCommand deleteCommand = new SqlCommand(deleteDoorTracking, databaseConnection))
                {
                    deleteCommand.Parameters.AddWithValue("@id", id);
                    int rowsAffected = deleteCommand.ExecuteNonQuery();
                    deleteString = $"Row(s) affected: {rowsAffected}.\nDoorTracking with id {id} deleted.";
                }
                return deleteString;
            }
        }

        int GetId()
        {
            if (GetAll().LongCount() != 0 )
            {
                int max = GetAll().Max(x => x.Id);
                return max + 1;
            }
            else
            {
                return 1;
            }

        }
    }
}
