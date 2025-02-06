function UTCToLocal(zuluDateStr) {
  const date = new Date(zuluDateStr);
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatter.format(date);
}

const inputTime = "2024-11-22T01:15Z";
const formatted = UTCToLocal(inputTime);
console.log(`Input time: ${inputTime}\nOutput: ${formatted}`);
