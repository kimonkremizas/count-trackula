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

        List<DoorTracking> DoorTrackingList = new List<DoorTracking>();

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
            // local save to json file
            string json = System.Text.Json.JsonSerializer.Serialize(DoorTrackingList);
            var size = json.Length * sizeof(Char);

            if (size < 2000000)
            {
                string filePath = @".";
                string fileName = @"CountTrackulaWebAPI.json";
                using (StreamWriter outputFile = new StreamWriter(Path.Combine(filePath, fileName)))
                {
                    outputFile.Write(json);
                }

            }
            return DoorTrackingList;
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
