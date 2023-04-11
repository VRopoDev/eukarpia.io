import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { updateStats } from "../helpers/updateStats.js";

/**
 * (READ OPERATION)
 * Middleware to get all transactions of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const getAllTransactions = async (req, res) => {
  try {
    const { organisation } = res.locals.user;
    // sort should look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
      $and: [
        { organisation: organisation },
        {
          $or: [
            { description: { $regex: new RegExp(search, "i") } },
            { product: { $regex: new RegExp(search, "i") } },
            { type: { $regex: new RegExp(search, "i") } },
          ],
        },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      $and: [
        { organisation: organisation },
        {
          $or: [
            { description: { $regex: new RegExp(search, "i") } },
            { product: { $regex: new RegExp(search, "i") } },
            { type: { $regex: new RegExp(search, "i") } },
          ],
        },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);
    res.status(200).json({ transactions, total });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (CREATE OPERATION)
 * Middleware to create a transaction for an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const createTransaction = async (req, res) => {
  try {
    const { userId, organisation } = res.locals.user;
    const data = req.body;
    data.organisation = organisation;
    const user = await User.findById(userId);
    data.createdBy = `${user.firstname} ${user.lastname}`;
    const transaction = new Transaction(data);
    const newTransaction = await transaction.save();
    if (newTransaction.type === "sale") {
      updateStats(organisation);
    }
    res.status(200).json({ success: true, newTransaction });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (UPDATE OPERATION)
 * Middleware to update a transaction of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const updateTransaction = async (req, res) => {
  try {
    const { _id } = req.body;
    const { organisation } = res.locals.user;
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      _id,
      req.body
    );
    if (updatedTransaction.type === "sale") {
      updateStats(organisation);
    }
    res.status(200).json({ success: true, updatedTransaction });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (DELETE OPERATION)
 * Middleware to delete a transaction of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
