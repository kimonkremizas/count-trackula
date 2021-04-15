import createChart from "./graph"


let maximumCustomers: HTMLInputElement = <HTMLInputElement>document.getElementById("maximumCustomersInput");
let warningRange: HTMLInputElement = <HTMLInputElement>document.getElementById("warningRangeInput");
let email: HTMLInputElement = <HTMLInputElement>document.getElementById("emailInput");

let maximumCustomersValue = maximumCustomers.value;
let warningRangeValue = warningRange.value;
let emailValue = email.value;

let setCookieButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("setCookieButton")
setCookieButton.addEventListener("click", setCookie);
// let getCookieButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getCookieButton")
// getCookieButton.addEventListener("click", getCookie);
// let clearTextBoxesButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("clearTextBoxesButton")
// clearTextBoxesButton.addEventListener("click", clearTextBoxes);
let deleteCookiesButtonSettings: HTMLButtonElement = <HTMLButtonElement>document.getElementById("deleteCookiesButtonSettings")
deleteCookiesButtonSettings.addEventListener("click", deleteCookies);
let deleteCookiesButtonOverlay: HTMLButtonElement = <HTMLButtonElement>document.getElementById("deleteCookiesButtonOverlay")
deleteCookiesButtonOverlay.addEventListener("click", deleteCookies);


//  Cookies
function setCookie() {
  setAnyCookie("maximumCustomers", maximumCustomers.value);
  setAnyCookie("warningRange", warningRange.value);
  setAnyCookie("email", email.value);
  alert("Settings saved succesfully.");
  createChart();
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


export function getMaximumCustomersCookie() {
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

export function getWarningRangeCookie() {
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


export function getEmailCookie() {
  var name = "email=";
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
  alert("Settings cleared succesfully.");
  createChart();
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

maximumCustomers.onchange = warningRange.onchange = WarningRangeLimit;