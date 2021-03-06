const intervals = [
  { label: "year", seconds: 31536000 },
  { label: "month", seconds: 2592000 },
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "minute", seconds: 60 },
  { label: "second", seconds: 1 },
];

export const timeSince = (date: Date) => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const interval = intervals.find(interval => seconds >= interval.seconds);
  if (!interval) return "just now";

  const count = Math.floor(seconds / interval.seconds);
  return `${count} ${interval.label}${count === 1 ? '' : 's'} ago`;
}


export const capitalizeFirstLetter = (content: string) => {
  var str = content.charAt(0).toUpperCase() + content.slice(1).toLowerCase();
  return str.replace(/[^A-Za-z0-9]/g, " ");
};
