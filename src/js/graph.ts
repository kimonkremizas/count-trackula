import  {getMaximumCustomersCookie} from "./cookies";
import  {getWarningRangeCookie} from "./cookies";


var Highcharts = require('highcharts');
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/data')(Highcharts);

let pollingCheckbox: HTMLInputElement = <HTMLInputElement>document.getElementById('enablePolling');
let pollingInput: HTMLInputElement = <HTMLInputElement>document.getElementById('pollingTime');

document.addEventListener('DOMContentLoaded', createChart);


Highcharts.setOptions({
  time: {
    timezoneOffset: 1 * 60
  }
});



export default function createChart() {
  var chart = Highcharts.chart('container', {
    chart: {
      type: 'area',
      zoomType: 'x'
    },
    title: {
      text: 'Occupancy'
    },
    xAxis: {
      title: {
        text: 'Time'
      },
    },
    yAxis: {
      title: {
        text: 'Occupancy'
      },
      plotLines: [{
        value: +getMaximumCustomersCookie(),
        color: 'black',
        width: 1,
        zIndex: 3,
        label: {
          text: 'Maximum Customers',
          align: 'center',
          x: -60,
          style: {
            color: 'black'
          }
        }
      },
      {
        value: +getMaximumCustomersCookie() - (+getWarningRangeCookie()),
        color: 'red',
        width: 1,
        dashStyle: 'dash',
        zIndex: 4,
        label: {
          text: 'Warning limit',
          align: 'center',
          x: 60,
          style: {
            color: 'red'
          }
        }
      }
      ],
      plotBands: [{
        from: +getMaximumCustomersCookie(),
        to: +getMaximumCustomersCookie() - (+getWarningRangeCookie()),
        color: 'rgba(255, 255, 0, 0.2)',
        width: 1

      }]

    },
    // subtitle: {
    //   text: 'Data input from a remote JSON file'
    // },
    legend: {
      enabled: false
    },
    data: {
      rowsURL: jsonGraphUrl,
      firstRowAsNames: false,
      enablePolling: pollingCheckbox.checked === true,
      dataRefreshRate: validatePollingInput()
    }
  });

}

function validatePollingInput(): number {
  if (+pollingInput.value < 5 || !+pollingInput.value) {
    pollingInput.value = "5";
  }
  return parseInt(pollingInput.value, 10)
}

// We recreate instead of using chart update to make sure the loaded CSV
// and such is completely gone.
pollingCheckbox.onchange = pollingInput.onchange = createChart;

// Create the chart
createChart();



// Graphs buttons

let todayJsonStringUrl: string = "https://counttrackulawebapi.azurewebsites.net/api/DoorsTracking/GetTodayToJson";
let lastWeekJsonStringUrl: string = "https://counttrackulawebapi.azurewebsites.net/api/DoorsTracking/GetLastWeekToJson";
let lastMonthJsonStringUrl: string = "https://counttrackulawebapi.azurewebsites.net/api/DoorsTracking/GetLastMonthToJson";
let allJsonStringUrl: string = "https://counttrackulawebapi.azurewebsites.net/api/DoorsTracking/GetAllToJson";
let jsonGraphUrl: string = todayJsonStringUrl;


let GetAllToJsonButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("GetAllToJsonButton");
let GetLastMonthToJsonButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("GetLastMonthToJsonButton");
let GetLastWeekToJsonButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("GetLastWeekToJsonButton");
let GetTodayToJsonButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("GetTodayToJsonButton");


GetAllToJsonButton.addEventListener("click", function () { jsonGraphUrl = allJsonStringUrl; createChart(); });
GetLastMonthToJsonButton.addEventListener("click", function () { jsonGraphUrl = lastMonthJsonStringUrl; createChart(); });
GetLastWeekToJsonButton.addEventListener("click", function () { jsonGraphUrl = lastWeekJsonStringUrl; createChart(); });
GetTodayToJsonButton.addEventListener("click", function () { jsonGraphUrl = todayJsonStringUrl; createChart(); });

var btns = document.getElementsByClassName("graphButtons");
for (var i: any = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}