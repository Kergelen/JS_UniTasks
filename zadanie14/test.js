const { unixTimeToDate, getDay, getMonth, getYear, getFormattedDate } = require('unix-time-fryzen');

const unixTime = 1717516891; // 4 czerwca 2024 r
const date = unixTimeToDate(unixTime);

console.log(`${date}`); 
console.log(`Dzień: ${getDay(date)}`); 
console.log(`Miesiąc: ${getMonth(date)}`); 
console.log(`Rok: ${getYear(date)}`); 
console.log(`Data: ${getFormattedDate(date)}`); 