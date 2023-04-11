import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";
import { updateStats } from "../helpers/updateStats.js";

export const getDashboardStats = async (req, res) => {
  try {
    const { organisation } = res.locals.user;
    const today = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const currentMonth = months[today.getMonth()];
    const currentYear = today.getFullYear();
    const m =
      today.getMonth() < 10
        ? `0${today.getMonth() + 1}`
        : `${today.getMonth() + 1}`;
    const d =
      today.getDate() < 10 ? `0${today.getDate()}` : `${today.getDate()}`;
    const currentDay = `${currentYear}-${m}-${d}`;

    /* Recent Transactions */
    const transactions = await Transaction.find({ organisation: organisation })
      .limit(50)
      .sort({ createdOn: -1 });

    /* Overall Stats */
    let overallStat = await OverallStat.find({
      $and: [{ year: currentYear }, { organisation: organisation }],
    });

    if (overallStat.length === 0) {
      await updateStats(organisation);
      overallStat = await OverallStat.find({
        $and: [{ year: currentYear }, { organisation: organisation }],
      });
    }

    const {
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
    } = overallStat[0];

    const thisMonthStats = overallStat[0].monthlyData.find(({ month }) => {
      return month === currentMonth;
    });

    const todayStats = overallStat[0].dailyData.find(({ date }) => {
      return date === currentDay;
    });

    res.status(200).json({
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats,
      transactions,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
