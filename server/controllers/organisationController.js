import Organisation from "../models/Organisation.js";
import Field from "../models/Field.js";
import User from "../models/User.js";
import Contact from "../models/Contact.js";
import Transaction from "../models/Transaction.js";
import OverallStat from "../models/OverallStat.js";
import Device from "../models/Device.js";
import IoT from "../models/Iot.js";
import Command from "../models/Command.js";
import Notification from "../models/Notification.js";

/**
 * (READ OPERATION)
 * Middleware to get all organisation details.
 * @param {*} req the request
 * @param {*} res the response
 */
export const getOrg = async (req, res) => {
  try {
    const org = res.locals.user.organisation;
    const organisation = await Organisation.findById(org);
    res.status(200).json(organisation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (READ OPERATION)
 * Middleware to get notifications of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const getOrgNotifications = async (req, res) => {
  try {
    const org = res.locals.user.organisation;
    const notifications = await Notification.find({ organisation: org });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (UPDATE OPERATION)
 * Middleware to update organisation details.
 * @param {*} req the request
 * @param {*} res the response
 */
export const updateOrg = async (req, res) => {
  try {
    const org = res.locals.user.organisation;
    const updatedOrganisation = await Organisation.findByIdAndUpdate(
      org,
      req.body
    );

    res.status(200).json({ success: true, updatedOrganisation });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (DELETE OPERATION)
 * Middleware to delete an organisation and all its data.
 * @param {*} req the request
 * @param {*} res the response
 */
export const deleteOrgNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (DELETE OPERATION)
 * Middleware to delete an organisation and all its data.
 * @param {*} req the request
 * @param {*} res the response
 */
export const deleteOrg = async (req, res) => {
  try {
    const org = res.locals.user.organisation;
    await Field.deleteMany({ organisation: org });
    await User.deleteMany({ organisation: org });
    await Contact.deleteMany({ organisation: org });
    await Transaction.deleteMany({ organisation: org });
    await OverallStat.deleteMany({ organisation: org });
    await Device.deleteMany({ organisation: org });
    await IoT.deleteMany({ organisation: org });
    await Command.deleteMany({ organisation: org });
    await Notification.deleteMany({ organisation: org });
    await Organisation.findByIdAndDelete(org);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
