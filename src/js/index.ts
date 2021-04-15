import axios, { AxiosResponse, AxiosError } from "../../node_modules/axios/index";
import { IDoorTracking } from "./IDoorTracking";
import { DateTime } from "luxon";
import  {getMaximumCustomersCookie} from "./cookies";
import  {getWarningRangeCookie} from "./cookies";
import  {getEmailCookie} from "./cookies";
import getWeatherWidget from "./weather";
import {SendWarningEmail} from "./email"

export let doorTrackingWebUrl: string = "https://counttrackulawebapi.azurewebsites.net/api/DoorsTracking";

let getLastContent: HTMLParagraphElement = <HTMLParagraphElement>document.getElementById("Occupancy");
export let counter: number= 0;

setInterval(function GetCurrentOccupancy() {
  axios.get(doorTrackingWebUrl + "/GetCurrentOccupancyValue")
    .then(function (AxiosResponse): void {
      //console.log("AxiosResponse: ",AxiosResponse);
      //console.log("Status Code: ",AxiosResponse.status);
      getLastContent.innerHTML = AxiosResponse.data.toString();
      if (getMaximumCustomersCookie() != "") {

        if ((AxiosResponse.data >= +getMaximumCustomersCookie() - (+getWarningRangeCookie())) && counter==0) {
          overlayOn();
          SendWarningEmail();
          counter += 1;
        }
       else if((AxiosResponse.data < +getMaximumCustomersCookie() - (+getWarningRangeCookie())) && counter!=0) {
        overlayOff();
        counter = 0;
       }
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

// let overlayButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("overlayButton")
// overlayButton.addEventListener("click", overlayOn);

let overlay: HTMLDivElement = <HTMLDivElement>document.getElementById("overlay")
overlay.addEventListener("click", overlayOff);


// GRAPHS PAGE


// Use Weather API

getWeatherWidget();



// call to our api where we call mailchimp's api 




