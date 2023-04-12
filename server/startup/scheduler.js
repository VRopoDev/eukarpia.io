import { CronJob } from "cron";
import { getWeatherData } from "../tasks/getWeather.js";
import Field from "../models/Field.js";

/**
 * Exported cron scheduler module
 */
export const scheduler = async (org, weatherapi, apiKey) => {
  /**
   * OpenWeatherMap API
   * Schedulled job to retieve weather data.
   */
  const weatherJob = new CronJob("59 23 * * *", async () => {
    const locations = [];
    const fields = await Field.find({ organisation: org }).lean().exec();
    fields.forEach((field) => {
      if (!locations.includes(field.city)) {
        locations.push(field.city);
      }
    });

    locations.forEach(async (location) => {
      getWeatherData(location, weatherapi, apiKey, org);
    });
  });
  weatherJob.start();
};
