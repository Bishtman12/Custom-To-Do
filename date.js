module.exports.getDate = getDate;

function getDate() {
  //   switch (getDay) {
  //     case 0:
  //       day = "Sunday";
  //       break;
  //     case 1:
  //       day = "Monday";
  //       break;
  //     case 2:
  //       day = "Tuesday";
  //       break;
  //     case 3:
  //       day = "Wednesday";
  //       break;
  //     case 4:
  //         day = "Thrusday";
  //         break;
  //      case 5:
  //         day = "Friday";
  //         break;
  //     case 6:
  //         day = "Saturday";
  //         break;
  //     default:
  //         console.log("Error:Not Fetching " + getDay);
  //   }
  let today = new Date();
  let getDay = today.getDay();
  let options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  let day = today.toLocaleDateString("en-US", options);
  return day;
}

exports.getDay = function () {
  let today = new Date();
  let getDay = today.getDay();
  let options = {
    weekday: "long",
  };
  let day = today.toLocaleDateString("en-US", options);
  return day;
}
