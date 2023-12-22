const handlers = {
  milliseconds: {
    // return one week or weeks number in millseconds
    weeks: weeks => (1000 * 60 * 60 * 24 * 7) * (weeks ? weeks : 1),
    // return one day or days number in millseconds
    days: days => (1000 * 60 * 60 * 24) * (days ? days : 1),
    // return one hour or hours number in millseconds
    hours: hours => (1000 * 60 * 60) * (hours ? hours : 1),
    // return one minute or mins number in millseconds
    minutes: mins => (1000 * 60) * (mins ? mins : 1),
    // return one second or secs number in millseconds
    seconds: secs => (1000) * (secs ? secs : 1),
  },
  stableDateFormat(date) {
    date = date ? new Date(date) : new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const amPm = date.getHours() >= 12 ? 'PM' : 'AM';

    const stableFormat = `${month}-${day}-${year}, ${hours}_${minutes}_${seconds} ${amPm}`;
    return stableFormat;
  },
  dates: {
    // timeOffset = the hours of the coutry in UTC like +2 for EG, +3 for KSA
    getCountryTime(countryTimeOffset) {
      const d = new Date();
      const localTime = d.getTime();
      const localOffset = d.getTimezoneOffset() * 60000;
      const utc = localTime + localOffset;
      const Country = utc + (3600000 * countryTimeOffset);
      return new Date(Country).toLocaleString();
    },
    KsaTime: () => handlers.dates.getCountryTime(3), // UTC of Riyadh (Saudi Arabia) is +03.00
    EgTime: () => handlers.dates.getCountryTime(2), // UTC of Egypt is +02.00
  },
};


module.exports = { ...handlers };
