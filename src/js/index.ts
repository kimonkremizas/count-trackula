import axios, { AxiosResponse, AxiosError } from "../../node_modules/axios/index";
import { IDoorTracking } from "./IDoorTracking";
import { DateTime } from "luxon";
import  {getMaximumCustomersCookie} from "./cookies";
import  {getWarningRangeCookie} from "./cookies";
import getWeatherWidget from "./weather";

let doorTrackingWebUrl: string = "https://counttrackulawebapi.azurewebsites.net/api/DoorsTracking";

let getLastContent: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("Occupancy");

setInterval(function GetCurrentOccupancy() {
  axios.get(doorTrackingWebUrl + "/GetCurrentOccupancyValue")
    .then(function (AxiosResponse): void {
      //console.log("AxiosResponse: ",AxiosResponse);
      //console.log("Status Code: ",AxiosResponse.status);
      getLastContent.innerHTML = AxiosResponse.data.toString();
      if (getMaximumCustomersCookie() != "") {
        if (AxiosResponse.data >= +getMaximumCustomersCookie() - (+getWarningRangeCookie())) {
          overlayOn();
          //sendEmail();
        }
        else { overlayOff() }
      }
    })
    .catch(function (error: AxiosError): void {
      console.log(error);
      let errorMessage = "Error Code: " + error.response.status;
      console.log(errorMessage);
    })
}, 3000);//run  every 3 seconds

// Overlay

function overlayOn() {
  document.getElementById("overlay").style.display = "block";
}

function overlayOff() {
  document.getElementById("overlay").style.display = "none";
}

let overlayButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("overlayButton")
overlayButton.addEventListener("click", overlayOn);

let overlay: HTMLDivElement = <HTMLDivElement>document.getElementById("overlay")
overlay.addEventListener("click", overlayOff);


// GRAPHS PAGE


// Use Weather API

getWeatherWidget();



// NODEMAILER 

let sendEmailButton: HTMLInputElement = <HTMLInputElement> document.getElementById("sendEmailButton");
// sendEmailButton.addEventListener("click", sendEmail);



// COMMENTS TO BE REMOVED!!!!










































//document.getElementById('forecastDay2').innerHTML = DateTime.fromSeconds(AxiosResponse.data.daily[1].dt).weekdayLong.toString();


//     public get weekdayLong: stringsource
// Get the human readable long weekday, such as 'Monday'. Defaults to the system's locale if no locale has been specified

// Example:
// DateTime.local(2017, 10, 30).weekdayLong //=> Monday

// console.log("CONVERTED TIME:",DateTime.fromSeconds(1607498810).toISO());
// let weatherUrl: string ="http://openweathermap.org/img/wn/01d@2x.png"
// let weatherIcon = document.getElementById('weatherIcon')
// weatherIcon.setAttribute("src",weatherUrl);



//3563b84c8d5badda0ca2c441bb96f22545c3c436


// Nodemailer
// require('dotenv').config();
// const nodemailer = require('nodemailer');


// // Step 1

// let transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     // user: process.env.EMAIL,
//     // pass: process.env.PASSWORD
//     user: 'real.count.trackula@gmail.com',
//     pass: 'Zealand2020'
//   }
// });

// // Step 2
// let mailOptions ={
//   from: 'real.count.trackula@gmail.com',
//   to: 'k.kremizas@gmail.com',
//   subject: 'Test subject',
//   text: 'Test text'
// };

// // Step 3

// function sendEmail(){
//   transporter.sendMail(mailOptions, function(err: any, data: any){
//   if (err) {
//     console.log('Errror occurs', err);
//   }
//   else{
//     console.log('Email sent!!!')
//   }
// });
// }



// let sendEmailButton: HTMLInputElement = <HTMLInputElement> document.getElementById("sendEmailButton");
// sendEmailButton.addEventListener("click", sendEmail);

// SENDGRID

// var SendGrid = require('@sendgrid/mail');


// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: 'k.kremizas@gmail.com',
//   from: 'real.count.trackula@gmail.com', // Use the email address or domain you verified above
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// //ES6
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
  // .catch((error) => {
  //   console.error(error)
  // })















// let getAllButton:HTMLButtonElement = <HTMLButtonElement> document.getElementById("getAllButton")
// let clearGetAllListButton:HTMLButtonElement =<HTMLButtonElement> document.getElementById("clearGetAllListButton")
// let getButton:HTMLButtonElement = <HTMLButtonElement> document.getElementById("getButton")
// let getLastButton:HTMLButtonElement = <HTMLButtonElement> document.getElementById("getLastButton")
// let addButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("addButton")
// let updateButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("updateButton")
// let deleteButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("deleteButton")

// let carsElement: HTMLUListElement = <HTMLUListElement> document.getElementById("carsContent");
// let getContent: HTMLDivElement = <HTMLDivElement> document.getElementById("getContent");

// let postContent: HTMLDivElement = <HTMLDivElement>document.getElementById("postContent");
// let putContent: HTMLDivElement = <HTMLDivElement>document.getElementById("putContent");
// let deleteContent: HTMLDivElement = <HTMLDivElement>document.getElementById("deleteContent");

// getAllButton.addEventListener("click", GetAllDoorTrackings);
// clearGetAllListButton.addEventListener("click",ClearGetAllList);
// getButton.addEventListener("click",GetDoorTracking);
// getLastButton.addEventListener("click",GetCurrentOccupancy);
// addButton.addEventListener("click", AddCar);
// updateButton.addEventListener("click", UpdateCar);
// deleteButton.addEventListener("click", DeleteCar);

// let DataArray: IDoorTracking[] = [];


// function GetAllDoorTrackings(){
//     axios.get<IDoorTracking[]>(doorTrackingWebUrl)
//     .then(function(AxiosResponse):void{
//         console.log("AxiosResponse: ",AxiosResponse);
//         console.log("Status Code: ",AxiosResponse.status);
//         const { data } = AxiosResponse;
//         ClearGetAllList();
//         AxiosResponse.data.forEach((doorTracking: IDoorTracking) => {
//          let newNode:HTMLLIElement = AddLiElement('ID: '+doorTracking.id+', DateTime: '+doorTracking.dateTime+', Occupancy: '+doorTracking.occupancy+', IsEntrance: '+doorTracking.isEntrance);
//          carsElement.appendChild(newNode);

//         });
//     })
//     .catch(function(error:AxiosError):void{
//         console.log(error);
//         let errorMessage = "Error Code: "+error.response.status;
//         console.log(errorMessage);
//     })
// }


// function GetCurrentOccupancy(){
//     axios.get(doorTrackingWebUrl + "/GetCurrentOccupancyValue")
//     .then(function(AxiosResponse):void{
//         console.log("AxiosResponse: ",AxiosResponse);
//         console.log("Status Code: ",AxiosResponse.status);
//         getLastContent.innerHTML = AxiosResponse.data.toString();
//         })
//     .catch(function(error:AxiosError):void{
//         console.log(error);
//         let errorMessage = "Error Code: "+error.response.status;
//         console.log(errorMessage);
//     })
// }





// function GetDoorTracking():void{
//     let getInput: HTMLInputElement = <HTMLInputElement> document.getElementById("getInput");
//     let getInputValue : number = +getInput.value;
//     axios.get(doorTrackingWebUrl + "/" + getInputValue)
//     .then(function(response: AxiosResponse<IDoorTracking>):void{
//         console.log(response);
//         console.log("Statuscode is :" + response.status);
//         let doorTracking:IDoorTracking = response.data;
//         console.log(doorTracking);
//         if (response.status!=204){
//             getContent.innerHTML = "Current Occupancy: " + doorTracking.occupancy;
//         }
//         else {
//             getContent.innerHTML = "No trigger found with this ID. Try again!";
//         }

//             // Clear getContent after 3 seconds
//             //HideContent(getContent);


//     })
//     .catch(function(error:AxiosError):void{
//         console.log(error);
//     })
// }



// function AddCar(): void {
//     let addVendorInput: HTMLInputElement = <HTMLInputElement>document.getElementById("addVendorInput");
//     let addModelInput: HTMLInputElement = <HTMLInputElement>document.getElementById("addModelInput");
//     let addPriceInput: HTMLInputElement = <HTMLInputElement>document.getElementById("addPriceInput");

//     let myVendor: string = addVendorInput.value;
//     let myModel: string = addModelInput.value;
//     let myPrice: number = +addPriceInput.value;

//     axios.post<ICustomerCount>(carWebUrl,
//         { vendor: myVendor, model: myModel, price: myPrice })
//         .then(function (response: AxiosResponse): void {
//             console.log("Statuscode is :" + response.status);
//             let message: string = response.data;
//             postContent.innerHTML = message;
//             // Clear postContent after 3 seconds
//             HideContent(postContent);


//         })
//         .catch(
//             function (error: AxiosError): void {
//                 console.log(error);
//                 postContent.innerHTML = "Wrong information entered. Try again!";

//                 // Clear postContent after 3 seconds
//                 HideContent(postContent);
//             }
//         )
// }

// function UpdateCar(): void {
//     let updateIdInput: HTMLInputElement = <HTMLInputElement>document.getElementById("updateIdInput");
//     let updateVendorInput: HTMLInputElement = <HTMLInputElement>document.getElementById("updateVendorInput");
//     let updateModelInput: HTMLInputElement = <HTMLInputElement>document.getElementById("updateModelInput");
//     let updatePriceInput: HTMLInputElement = <HTMLInputElement>document.getElementById("updatePriceInput");

//     let myId: number = +updateIdInput.value;
//     let myVendor: string = updateVendorInput.value;
//     let myModel: string = updateModelInput.value;
//     let myPrice: number = +updatePriceInput.value;

//     axios.put<ICustomerCount>(carWebUrl + "/" + myId ,
//         { id: myId, vendor: myVendor, model: myModel, price: myPrice })
//         .then(function (response: AxiosResponse): void {
//             console.log("Statuscode is :" + response.status);
//             let message: string = response.data;
//             putContent.innerHTML = message;

//             // Clear postContent after 3 seconds
//             HideContent(putContent);


//         })
//         .catch(
//             function (error: AxiosError): void {
//                 console.log(error);
//                 putContent.innerHTML = "Wrong information entered. Try again!";

//                 // Clear postContent after 3 seconds
//                 HideContent(putContent);
//             }
//         )
// }

// function DeleteCar(): void {
//     let deleteInput: HTMLInputElement = <HTMLInputElement>document.getElementById("deleteInput");
//     let myId: number = +deleteInput.value;

//     axios.delete(carWebUrl + "/" + myId)
//         .then(function (response: AxiosResponse): void {
//             console.log("Statuscode is :" + response.status);
//             let message: string = response.data;
//             deleteContent.innerHTML = message;

//             // Clear postContent after 3 seconds
//             HideContent(deleteContent);


//         })
//         .catch(
//             function (error: AxiosError): void {
//                 console.log(error);
//                 deleteContent.innerHTML = "Wrong information entered. Try again!";

//                 // Clear postContent after 3 seconds
//                 HideContent(deleteContent);
//             }
//         )
// }


// function AddLiElement(text:string):HTMLLIElement {
//     let newLi:HTMLLIElement = document.createElement('li');
//     let newTextNode:Text = document.createTextNode(text)
//     newLi.appendChild(newTextNode);
//     return newLi;
// }

// function ClearGetAllList():void{
//     while (carsElement.firstChild){
//         carsElement.removeChild(carsElement.lastChild)
//     }
// }

// // Clear Content after 3 seconds
// function HideContent(contentName:HTMLDivElement){
//     clearTimeout(timeout);
//     timeout = setTimeout(function () {
//         contentName.innerHTML = "";
//         }, 3000);
// }





// console.log(DataArray);



// function ConvertData(){

// var regexString = /(\d+)\-(\d+)\-(\d+)\D\:(\d+)\:(\d+)\:(\d+)\,(\d+)/;
// var originalData = '2016-01-17T:08:44:29,99';
// let year:number= +originalData.replace(regexString, '$1');
// let month:number= +originalData.replace(regexString, '$2');
// let day:number= +originalData.replace(regexString, '$3');
// let hour:number= +originalData.replace(regexString, '$4');
// let minute:number= +originalData.replace(regexString, '$5');
// let second:number= +originalData.replace(regexString, '$6');
// let customerCount:number= +originalData.replace(regexString, '$7');

// console.log(year+","+month+","+day+","+hour+","+minute+","+second+","+customerCount);
// }








