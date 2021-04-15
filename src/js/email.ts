import axios, { AxiosResponse, AxiosError } from "../../node_modules/axios/index";
import { getEmailCookie } from "./cookies";
import { doorTrackingWebUrl } from "./index";

export function SendWarningEmail() {

    let email: string = getEmailCookie().toString();
  
  
    axios.post<string>(doorTrackingWebUrl + "/WarningEmail","\""+email+"\"", {
      headers: {
          "Accept": "application/json",
          "Content-type": "application/json"
      }
      })
      .then(function (AxiosResponse): void {
        console.log("AxiosResponse: ",AxiosResponse);
        console.log("Status Code: ",AxiosResponse.status);
      })
      .catch(function (error: AxiosError): void {
        console.log(error);
        let errorMessage = "Error Code: " + error.response.status;
        console.log(errorMessage);
      })
  }