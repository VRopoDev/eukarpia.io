import CronJob from "cron";
import { getWeatherData } from "../tasks/getWeather.js";
import Field from "../models/Field.js";

/**
 * Exported cron scheduler module
 */
export const scheduler = async () => {
  /**
   * OpenWeatherMap API
   * Schedulled job to retieve weather data.
   * Will only run for one organisation container set up in the env
   */
  const weatherJob = new CronJob("0 0 12 * * *", async () => {
    const org = process.env.ORGID;
    const apiKey = process.env.WEATHERKEY;
    const locations = [];
    const fields = await Field.find({ organisation: org }).lean().exec();
    fields.forEach((field) => {
      locations.push(field.city);
    });

    locations.forEach(async (location) => {
      getWeatherData(location, apiKey, org);
    });
  });

  if (process.env.WEATHERKEY) {
    weatherJob.start();
  }
};
