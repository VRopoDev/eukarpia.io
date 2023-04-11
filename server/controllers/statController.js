import OverallStat from "../models/OverallStat.js";

/**
 * (READ OPERATION)
 * Middleware to get stats of the current year of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const getStats = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const organisation = res.locals.user.organisation;
    /* Overall Stats */
    const overallStats = await OverallStat.find({
      $and: [{ year: currentYear }, { organisation: organisation }],
    });

    res.status(200).json(overallStats[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
