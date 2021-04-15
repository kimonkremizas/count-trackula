import { getMaximumCustomersCookie } from "./cookies";
import { getWarningRangeCookie } from "./cookies";


var Highcharts = require('highcharts');
// Load module after Highcharts is loaded
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/data')(Highcharts);

let pollingCheckbox: HTMLInputElement = <HTMLInputElement>document.getElementById('enablePolling');
let pollingInput: HTMLInputElement = <HTMLInputElement>document.getElementById('pollingTime');

document.addEventListener('DOMContentLoaded', createAreaChart);


Highcharts.setOptions({
  time: {
    timezoneOffset: 1 * 60
  }
});



export default function createAreaChart() {
  var chart = Highcharts.chart('AreaContainer', {
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
pollingCheckbox.onchange = pollingInput.onchange = createAreaChart;







export function createHistogramChart() {
  var chart = Highcharts.chart('HistogramContainer', {
    chart: {
      type: 'column',
      zoomType: 'x'
    },
    title: {
      text: 'Daily Customers'
    },
    xAxis: {
      title: {
        text: 'Date'
      },
      type: 'datetime', 
      
    // Use the date format in the 
    // labels property of the chart 
    labels: { 
      formatter: function() { 
        return Highcharts.dateFormat('%A<br>%b %e ', 
                                      this.value); 
      } 
    } 
    },
    yAxis: {
      title: {
        text: 'Total Customers'
      },
    },
    // subtitle: {
    //   text: 'Data input from a remote JSON file'
    // },
    legend: {
      enabled: false
    },
    data: {
      rowsURL: lastWeekEntranceJsonStringUrl,
      firstRowAsNames: false,
      enablePolling: pollingCheckbox.checked === true,
      dataRefreshRate: validatePollingInput()
    },
    tooltip: {
      headerFormat: '{point.x:%A, %b %e, %Y} <br>',
      pointFormat: '<b>{point.y}</b> people entered',
      shared: true
  },

  });

}

let lastWeekEntranceJsonStringUrl: string = "https://counttrackulawebapi.azurewebsites.net/api/DoorsTracking/GetLastWeekEntranceToJson";



// Create the chart
createAreaChart();
createHistogramChart();


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


GetAllToJsonButton.addEventListener("click", function () { jsonGraphUrl = allJsonStringUrl; createAreaChart(); });
GetLastMonthToJsonButton.addEventListener("click", function () { jsonGraphUrl = lastMonthJsonStringUrl; createAreaChart(); });
GetLastWeekToJsonButton.addEventListener("click", function () { jsonGraphUrl = lastWeekJsonStringUrl; createAreaChart(); });
GetTodayToJsonButton.addEventListener("click", function () { jsonGraphUrl = todayJsonStringUrl; createAreaChart(); });

var btns = document.getElementsByClassName("graphButtons");
for (var i: any = 0; i < btns.length; i++) {
  btns[i].addEventListener("click", function () {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}