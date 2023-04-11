import axios from "axios";
import Notification from "../models/Notification.js";

export const getWeatherData = async (city, apiKey, org) => {
  try {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(url).then(async (response) => {
      const weatherData = response.data;
      const weather = {
        temperature: weatherData.main.temp,
        description: weatherData.weather[0].description,
      };
      const notification = new Notification({
        title: "Weather Alert",
        description: JSON.stringify(weather),
        organisation: org,
      });
      await notification.save();
      return;
    });
  } catch (error) {
    console.error(error);
  }
};
