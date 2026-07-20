const axios = require("axios");
const DailySummary = require("../models/DailySummary");
const Alert = require("../models/Alert");
const transporter = require("../utils/nodemailer");
const { getISTDate } = require("../utils/utils");

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const mailID = process.env.MAIL_ID;

const calcAvg = (avg, cnt, curr) => (avg * (cnt - 1) + curr) / cnt;

exports.fetchWeatherData = async (city) => {
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${city}:`, error);
    throw error;
  }
};

exports.calculateDailySummary = async (city) => {
  const today = getISTDate();

  const weatherData = await this.fetchWeatherData(city);
  if (!weatherData) return;

  const existingSummary = await DailySummary.findOne({ city, date: today });

  this.checkAlertsAndNotify(city, weatherData.main.temp);

  if (existingSummary) {
    existingSummary.__v += 1;

    existingSummary.avgTemp = calcAvg(
      existingSummary.avgTemp,
      existingSummary.__v,
      weatherData.main.temp
    );
    existingSummary.avgHumidity = calcAvg(
      existingSummary.avgHumidity,
      existingSummary.__v,
      weatherData.main.humidity
    );
    existingSummary.avgWindSpeed = calcAvg(
      existingSummary.avgWindSpeed,
      existingSummary.__v,
      weatherData.wind.speed
    );

    existingSummary.maxTemp = Math.max(
      existingSummary.maxTemp,
      weatherData.main.temp_max
    );
    existingSummary.minTemp = Math.min(
      existingSummary.minTemp,
      weatherData.main.temp_min
    );

    // Update weather conditions count
    const currentCondition = weatherData.weather[0].main;
    const currentCount =
      existingSummary.weatherConditions.get(currentCondition) || 0;
    existingSummary.weatherConditions.set(currentCondition, currentCount + 1);

    // Recalculate dominant condition
    let maxCount = 0;
    let dominantCondition = "";
    for (const [condition, count] of existingSummary.weatherConditions) {
      if (count > maxCount) {
        maxCount = count;
        dominantCondition = condition;
      }
    }

    existingSummary.dominantCondition = dominantCondition;

    await existingSummary.save();
  } else {
    const newSummary = new DailySummary({
      city,
      date: today,
      avgTemp: weatherData.main.temp,
      maxTemp: weatherData.main.temp_max,
      minTemp: weatherData.main.temp_min,
      avgHumidity: weatherData.main.humidity,
      avgWindSpeed: weatherData.wind.speed,
      dominantCondition: weatherData.weather[0].main,
      weatherConditions: new Map([[weatherData.weather[0].main, 1]]),
    });
    await newSummary.save();
  }
};

// Function to check alerts and send emails
exports.checkAlertsAndNotify = async (city, temperature) => {
  const alerts = await Alert.find({ city, threshold: { $lte: temperature } });

  for (const alert of alerts) {
    const mailOptions = {
      from: mailID,
      to: alert.email,
      subject: "Weather Alert",
      text: `The temperature in ${city} has exceeded your set threshold of ${alert.threshold}°C. Current temperature: ${temperature}°C.`,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);

      // Delete the alert after successful email delivery
      await Alert.findByIdAndDelete(alert._id);
      console.log("Alert deleted for:", alert.email);
    } catch (error) {
      console.log("Error sending email:", error);
    }
  }
};
