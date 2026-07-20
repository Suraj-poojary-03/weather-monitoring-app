const weatherService = require("../services/weatherService");
const DailySummary = require("../models/DailySummary");
const Alert = require("../models/Alert");
const { getISTDate } = require("../utils/utils");

exports.getCurrentWeather = async (req, res) => {
  try {
    const weatherData = await weatherService.fetchWeatherData(req.params.city);
    res.json(weatherData);
  } catch (error) {
    if (error.response.status === 404) {
      return res.status(404).json({
        error: "City not found. Please check the city name and try again.",
      });
    }
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

exports.getDailySummary = async (req, res) => {
  try {
    const today = getISTDate();

    const summary = await DailySummary.findOne({
      city: new RegExp(`^${req.params.city}$`, "i"),
      date: today,
    });
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch daily summary" });
  }
};

exports.getSummaries = async (req, res) => {
  try {
    const summaries = await DailySummary.find({
      city: new RegExp(`^${req.params.city}$`, "i"),
    });
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch summaries" });
  }
};

exports.setAlert = async (req, res) => {
  try {
    const { city, threshold, email } = req.body;
    const alert = new Alert({ city, threshold, email });
    await alert.save();
    res.status(200).json({ message: "Alert set successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error setting alert" });
  }
};
