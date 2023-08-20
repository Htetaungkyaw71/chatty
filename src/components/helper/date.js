export const formatDateAndTime = (dateTimeString) => {
  const dateObject = new Date(dateTimeString);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayOfWeek = daysOfWeek[dateObject.getDay()];

  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const amPM = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const hours12 = hours % 12 || 12; // If hours is 0, it becomes 12

  const today = new Date();
  const isToday = dateObject.toDateString() === today.toDateString();

  if (isToday) {
    return `${hours12}:${minutes < 10 ? "0" : ""}${minutes} ${amPM}`;
  } else {
    return `${dayOfWeek} at ${hours12}:${
      minutes < 10 ? "0" : ""
    }${minutes} ${amPM}`;
  }
};
