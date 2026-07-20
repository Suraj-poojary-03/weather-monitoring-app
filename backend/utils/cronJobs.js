const cron = require("node-cron");
const weatherService = require("../services/weatherService");

const CITIES = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bengaluru",
  "Kolkata",
  "Hyderabad",
];
const setupCronJobs = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Fetching weather data for all cities...");
    for (const city of CITIES) {
      await weatherService.calculateDailySummary(city);
    }
  });
};

module.exports = setupCronJobs;
