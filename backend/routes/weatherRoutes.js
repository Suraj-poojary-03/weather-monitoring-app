const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.get("/weather/:city", weatherController.getCurrentWeather);
router.get("/summary/:city", weatherController.getDailySummary);
router.get("/summaries/:city", weatherController.getSummaries);
router.post("/setAlert", weatherController.setAlert);

module.exports = router;
