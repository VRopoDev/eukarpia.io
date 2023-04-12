import axios from "axios";
import Notification from "../models/Notification.js";

export const getWeatherData = async (city, weatherapi, apiKey, org) => {
  try {
    const url = `${weatherapi}?q=${city}&units=metric&appid=${apiKey}`;
    axios
      .get(url)
      .then(async (response) => {
        const { data } = response;
        if (data) {
          const notification = new Notification({
            title: "Weather Alert",
            message:
              data.weather[0]?.main ||
              "No connection to weather api. Please check your credentials.",
            organisation: org,
          });
          await notification.save();
        }
        return;
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error(error);
  }
};
