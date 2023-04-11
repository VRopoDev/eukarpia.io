import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";
import Contact from "../models/Contact.js";

/**
 * (READ OPERATION)
 * Middleware to get an overview of the current year of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const updateStats = async (organisation) => {
  try {
    const currentYear = new Date().getFullYear();
    const customers = await Contact.find({
      $and: [{ organisation: organisation }, { connection: "customer" }],
    });
    const transactions = await Transaction.find({
      $and: [
        { organisation: organisation },
        { type: "sale" },
        {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lt: new Date(`${currentYear + 1}-01-01`),
          },
        },
      ],
    })
      .lean()
      .exec();
    const overallStats = new OverallStat({
      monthlyData: [
        { month: "January", totalSales: 0, totalUnits: 0 },
        { month: "February", totalSales: 0, totalUnits: 0 },
        { month: "March", totalSales: 0, totalUnits: 0 },
        { month: "April", totalSales: 0, totalUnits: 0 },
        { month: "May", totalSales: 0, totalUnits: 0 },
        { month: "June", totalSales: 0, totalUnits: 0 },
        { month: "July", totalSales: 0, totalUnits: 0 },
        { month: "August", totalSales: 0, totalUnits: 0 },
        { month: "September", totalSales: 0, totalUnits: 0 },
        { month: "October", totalSales: 0, totalUnits: 0 },
        { month: "November", totalSales: 0, totalUnits: 0 },
        { month: "December", totalSales: 0, totalUnits: 0 },
      ],
      totalCustomers: customers.length || 0,
      dailyData: [],
      yearlySalesTotal: 0,
      yearlyTotalSoldUnits: 0,
      salesByProduct: {},
      year: currentYear,
      organisation,
    });

    const currentDate = new Date();
    const todayString = currentDate.toISOString().substring(0, 10);

    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    for (let i = 1; i <= 12; i++) {
      let m = i < 10 ? `0${i}` : `${i}`;
      for (let j = 1; j <= daysInMonth[i]; j++) {
        let d = j < 10 ? `0${j}` : `${j}`;
        overallStats.dailyData.push({
          date: `${currentDate.getFullYear()}-${m}-${d}`,
          totalSales: 0,
          totalUnits: 0,
        });
      }
    }

    transactions.forEach((t) => {
      const month = t.createdAt.getMonth();
      const dateString = t.createdAt.toISOString().substring(0, 10);
      overallStats.monthlyData[month].totalSales += t.price;
      overallStats.monthlyData[month].totalUnits += t.quantity;
      if (todayString === dateString) {
        const index = overallStats.dailyData.findIndex(
          (data) => data.date === todayString
        );
        if (index !== -1) {
          overallStats.dailyData[index].totalSales += t.price;
          overallStats.dailyData[index].totalUnits += t.quantity;
        }
      }
      if (overallStats.salesByProduct[t.product]) {
        overallStats.salesByProduct[t.product] += t.price;
      } else {
        overallStats.salesByProduct[t.product] = t.price;
      }
      overallStats.yearlySalesTotal += t.price;
      overallStats.yearlyTotalSoldUnits += t.quantity;
    });

    await OverallStat.findOneAndDelete({ organisation: organisation });
    await overallStats.save();
    return;
  } catch (err) {
    console.error(err);
  }
};
