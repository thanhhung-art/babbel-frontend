export const Time = (messTime: string): string => {
  const messageTime = Number(messTime);
  const now = Date.now();

  const diff = now - messageTime;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  // Calculate months and years using date objects
  let months;
  let years;

  // Create date objects for the current time and the message time
  const nowDate = new Date(now);
  const messageDate = new Date(messageTime);

  // Calculate the difference in years
  years = nowDate.getFullYear() - messageDate.getFullYear();

  // Calculate the difference in months
  months =
    (nowDate.getFullYear() - messageDate.getFullYear()) * 12 +
    (nowDate.getMonth() - messageDate.getMonth());

  // Adjust for cases where the current day of month is less than the message day of month
  if (nowDate.getDate() < messageDate.getDate()) {
    months--;
  }

  let result: string;
  if (years > 0) {
    result = `${years}y`;
  } else if (months > 0) {
    result = `${months}mo`;
  } else if (weeks > 0) {
    result = `${weeks}w`;
  } else if (days > 0) {
    result = `${days}d`;
  } else if (hours > 0) {
    result = `${hours}h`;
  } else if (minutes > 0) {
    result = `${minutes}m`;
  } else {
    result = `${seconds}s`;
  }

  return result;
};
