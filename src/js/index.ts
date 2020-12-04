import axios, { AxiosResponse, AxiosError } from "../../node_modules/axios/index";
import { IDoorTracking } from "./IDoorTracking";


// let timeout: any;

let doorTrackingWebUrl: string = "https://counttrackulawebapi.azurewebsites.net/api/DoorsTracking";
//let doorTrackingWebUrl: string = "https://localhost:44371/api/DoorsTracking"


// let homeButton: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById("homeButton")
// homeButton.addEventListener("click", ShowHomePage);
// let graphsButton: HTMLAnchorElement = <HTMLAnchorElement>document.getElementById("graphsButton")
// graphsButton.addEventListener("click", ShowGraphsPage);

// function ShowHomePage(){

// }


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
        }
        else { overlayOff() }
      }
    })
    .catch(function (error: AxiosError): void {
      console.log(error);
      let errorMessage = "Error Code: " + error.response.status;
      console.log(errorMessage);
    })
}, 3000);//run this thang every 3 seconds



let maximumCustomers: HTMLInputElement = <HTMLInputElement>document.getElementById("maximumCustomersInput");
let warningRange: HTMLInputElement = <HTMLInputElement>document.getElementById("warningRangeInput");
let email: HTMLInputElement = <HTMLInputElement>document.getElementById("emailInput");

let maximumCustomersValue = maximumCustomers.value;
let warningRangeValue = warningRange.value;
let emailValue = email.value;

let setCookieButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("setCookieButton")
setCookieButton.addEventListener("click", setCookie);
let getCookieButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getCookieButton")
getCookieButton.addEventListener("click", getCookie);
let clearTextBoxesButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("clearTextBoxesButton")
clearTextBoxesButton.addEventListener("click", clearTextBoxes);
let deleteCookiesButtonSettings: HTMLButtonElement = <HTMLButtonElement>document.getElementById("deleteCookiesButtonSettings")
deleteCookiesButtonSettings.addEventListener("click", deleteCookies);
let deleteCookiesButtonOverlay: HTMLButtonElement = <HTMLButtonElement>document.getElementById("deleteCookiesButtonOverlay")
deleteCookiesButtonOverlay.addEventListener("click", deleteCookies);


//  Cookies
function setCookie() {
  setAnyCookie("maximumCustomers", maximumCustomers.value);
  setAnyCookie("warningRange", warningRange.value);
  setAnyCookie("email", email.value);
}

function setAnyCookie(cookieName: string, cookieValue: string) {
  var d = new Date();
  d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  var cookieString = cookieName + "=" + cookieValue;
  document.cookie = cookieString + ";" + expires + ";path=/";
}


function getCookie() {
  alert(document.cookie);
}


function getMaximumCustomersCookie() {
  var name = "maximumCustomers=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function getWarningRangeCookie() {
  var name = "warningRange=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function clearTextBoxes() {
  maximumCustomers.value = "";
  warningRange.value = "";
  email.value = "";
}

function deleteCookies() {
  document.cookie = "maximumCustomers= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "warningRange= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = "email= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
}

// collapsible start
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}
// collapsible end




// console.log(maximumCustomersValue);
// console.log(warningRangeValue);
// console.log(emailValue);

let saveSettingsButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("saveSettingsButton")
//saveSettingsButton.addEventListener("click", SaveSettings);

let maximumCustomersContent: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("maximumCustomersContent");
let warningRangeContent: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("warningRangeContent");
let emailContent: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("emailContent");


// Check if Warning Range is smaller than Maximum Customers

function WarningRangeLimit() {
  let maximumCustomersValue: number = +maximumCustomers.value;
  warningRange.setAttribute("max", (maximumCustomersValue - 1).toString());
}

maximumCustomers.onchange = WarningRangeLimit;
warningRange.onchange = WarningRangeLimit;


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

var Highcharts = require('highcharts');
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/data')(Highcharts);



document.addEventListener('DOMContentLoaded', function () {
  var chart = Highcharts.chart('container', {
    chart: {
      type: 'area'
    },
    title: {
      text: 'Occupancy - All Time'
    },

    // subtitle: {
    //   text: 'Data input from a remote JSON file'
    // },

    data: {
      rowsURL: 'https://counttrackulawebapi.azurewebsites.net/api/DoorsTracking/GetTodayToJson',
      firstRowAsNames: false,
      enablePolling: true
    }
  });
});


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





// var Highcharts = require('highcharts');  
// // Load module after Highcharts is loaded
// require('highcharts/modules/exporting')(Highcharts); 





// document.addEventListener('DOMContentLoaded', function () {
//     var chart = Highcharts.chart('container', {
//         chart: {
//             type: 'area'
//         },
//         title: {
//             text: 'Live Data (Rows JSON)'
//         },

//         subtitle: {
//             text: 'Data input from a remote JSON file'
//         },
//         series: [{
//             name: 'USA',
//             data: {
//             rowsURL: 'https://demo-live-data.highcharts.com/time-rows.json',
//             firstRowAsNames: false,
//             enablePolling: true
//              }
//             }]

//     });
// });








// document.addEventListener('DOMContentLoaded', function () {
//     var chart = Highcharts.chart('container', {
//         chart: {
//             type: 'area'
//         },
//         title: {
//             text: 'Live Data (Rows JSON)'
//         },

//         subtitle: {
//             text: 'Data input from a remote JSON file'
//         },
//         series: [{
//             name: 'USA',
//             data: [
//                 null, null, null, null, null, 6, 11, 32, 110, 235,
//                 369, 640, 1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468,
//                 20434, 24126, 27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342,
//                 26662, 26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
//                 24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586, 22380,
//                 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950, 10871, 10824,
//                 10577, 10527, 10475, 10421, 10358, 10295, 10104, 9914, 9620, 9326,
//                 5113, 5113, 4954, 4804, 4761, 4717, 4368, 4018
//                 ]
//             }]

//     });
// });
