
export function convertTimestampToDateTime(timestamp) {
  var timestampTemp = new Date(timestamp);
  var dateType = timestampTemp.toDateString();
  // dateType += " " + hoursLabel + ":" + minuteLabel + " " + ampm; // Removed am/pm https://oncelabs.xp-dev.com/trac/OPA/ticket/43
  dateType += " " + convertTimestampToTime(timestamp);//Fix for Ticket #198 and #197 - timestamps should be represented in 12 hour format
  return dateType;
}

export function convertTimestampToDate(timestamp) {
  var timestampTemp = new Date(timestamp);
  var dateType = timestampTemp.toDateString();
  return dateType;
}

export function convertTimestampToTime(timestamp) {
  var timestampTemp = new Date(timestamp);
  var hours = timestampTemp.getHours();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours > 12 ? hours - 12 : hours; //Fix for Ticket #198 and #197 - timestamps should be represented in 12 hour format
  var hoursLabel = (hours < 10) ? '0' + hours : hours;
  var minute = timestampTemp.getMinutes();
  var minuteLabel = (minute < 10) ? '0' + minute : minute; 
  return  hoursLabel + ":" + minuteLabel + " " + ampm; // Removed am/pm https://oncelabs.xp-dev.com/trac/OPA/ticket/43
}


export function convertSecondsToTime(seconds) {
  seconds = Number(seconds);
  var h = Math.floor(seconds / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 3600 % 60);
  var hDisplay = h > 0 ? h > 9 ? h + ":" : "0" + h + ":" : "00:";
  var mDisplay = m > 0 ? m > 9 ? m + ":" : "0" + m + ":" : "00:";
  var sDisplay = s > 0 ? s > 9 ? s : "0" + s : "00";
  return hDisplay + mDisplay + sDisplay;
}


export function findNumberOfDaysBetweenDates (date1, date2) {
	  let res = Math.abs(date1 - date2) / 1000;
  	let days = Math.floor(res / 86400);
	  return days;
 }