import axios, { AxiosResponse, AxiosError } from "../../node_modules/axios/index";
import { DateTime } from "luxon";

let city: string = "copenhagen";
let apikey: string = "7610a348061b41ee3454732884890eda";
let units: string = "metric";
let lat: string = "55.6709184";
let lon: string = "12.5599191";
let exclude: string = "minutely,hourly"

export default function getWeatherWidget(){
    axios.get("https://api.openweathermap.org/data/2.5/onecall" + "?lat=" + lat + "&lon=" + lon + "&exclude=" + exclude + "&appid=" + apikey + "&units=" + units)
    .then(function (AxiosResponse) {
      console.log("AxiosResponse: ", AxiosResponse);
      //console.log("Status Code: ", AxiosResponse.status);
      // This needs refactoring!!!!!
      // Load Temps
      document.getElementById('currentTemp').innerHTML = AxiosResponse.data.current.temp.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMaxTempDay1').innerHTML = "Max: " + AxiosResponse.data.daily[0].temp.max.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMinTempDay1').innerHTML = "Min: " + AxiosResponse.data.daily[0].temp.min.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMaxTempDay2').innerHTML = "Max: " + AxiosResponse.data.daily[1].temp.max.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMinTempDay2').innerHTML = "Min: " + AxiosResponse.data.daily[1].temp.min.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMaxTempDay3').innerHTML = "Max: " + AxiosResponse.data.daily[2].temp.max.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMinTempDay3').innerHTML = "Min: " + AxiosResponse.data.daily[2].temp.min.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMaxTempDay4').innerHTML = "Max: " + AxiosResponse.data.daily[3].temp.max.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMinTempDay4').innerHTML = "Min: " + AxiosResponse.data.daily[3].temp.min.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMaxTempDay5').innerHTML = "Max: " + AxiosResponse.data.daily[4].temp.max.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMinTempDay5').innerHTML = "Min: " + AxiosResponse.data.daily[4].temp.min.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMaxTempDay6').innerHTML = "Max: " + AxiosResponse.data.daily[5].temp.max.toString().slice(0, -3) + "°C";
      document.getElementById('forecastMinTempDay6').innerHTML = "Min: " + AxiosResponse.data.daily[5].temp.min.toString().slice(0, -3) + "°C";
      // Load Current Weather name
      document.getElementById('currentWeather').innerHTML = AxiosResponse.data.current.weather[0].main;
      // Load Weather icons
      document.getElementById('currentWeatherIcon').setAttribute("src", "https://openweathermap.org/img/wn/" + AxiosResponse.data.current.weather[0].icon + "@2x.png");
      document.getElementById('forecastWeatherIconDay1').setAttribute("src", "https://openweathermap.org/img/wn/" + AxiosResponse.data.daily[0].weather[0].icon + ".png");
      document.getElementById('forecastWeatherIconDay2').setAttribute("src", "https://openweathermap.org/img/wn/" + AxiosResponse.data.daily[1].weather[0].icon + ".png");
      document.getElementById('forecastWeatherIconDay3').setAttribute("src", "https://openweathermap.org/img/wn/" + AxiosResponse.data.daily[2].weather[0].icon + ".png");
      document.getElementById('forecastWeatherIconDay4').setAttribute("src", "https://openweathermap.org/img/wn/" + AxiosResponse.data.daily[3].weather[0].icon + ".png");
      document.getElementById('forecastWeatherIconDay5').setAttribute("src", "https://openweathermap.org/img/wn/" + AxiosResponse.data.daily[4].weather[0].icon + ".png");
      document.getElementById('forecastWeatherIconDay6').setAttribute("src", "https://openweathermap.org/img/wn/" + AxiosResponse.data.daily[5].weather[0].icon + ".png");
      // Load Days
      document.getElementById('forecastDay1').innerHTML = DateTime.fromSeconds(AxiosResponse.data.daily[0].dt).weekdayLong.toString();
      document.getElementById('forecastDay2').innerHTML = DateTime.fromSeconds(AxiosResponse.data.daily[1].dt).weekdayLong.toString();
      document.getElementById('forecastDay3').innerHTML = DateTime.fromSeconds(AxiosResponse.data.daily[2].dt).weekdayLong.toString();
      document.getElementById('forecastDay4').innerHTML = DateTime.fromSeconds(AxiosResponse.data.daily[3].dt).weekdayLong.toString();
      document.getElementById('forecastDay5').innerHTML = DateTime.fromSeconds(AxiosResponse.data.daily[4].dt).weekdayLong.toString();
      document.getElementById('forecastDay6').innerHTML = DateTime.fromSeconds(AxiosResponse.data.daily[5].dt).weekdayLong.toString();
    }
    )
    .catch(function (error: AxiosError) {
      console.log(error);
      let errorMessage = "Error Code: " + error.response.status;
      console.log(errorMessage);
    })
}

