import Contact from "../models/Contact.js";
import User from "../models/User.js";
import { updateStats } from "../helpers/updateStats.js";

/**
 * (READ OPERATION)
 * Middleware to get all contacts of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const getAllContacts = async (req, res) => {
  try {
    const { organisation } = res.locals.user;
    const contacts = await Contact.find({
      organisation: organisation,
    });
    res.status(200).json(contacts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (CREATE OPERATION)
 * Middleware to create a contact for an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const createContact = async (req, res) => {
  try {
    const { userId, organisation } = res.locals.user;
    const data = req.body;
    data.organisation = organisation;
    const user = await User.findById(userId);
    data.createdBy = `${user.firstname} ${user.lastname}`;
    const contact = new Contact(data);
    const newContact = await contact.save();
    if (newContact.connection === "customer") {
      updateStats(organisation);
    }
    res.status(200).json({ success: true, newContact });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (UPDATE OPERATION)
 * Middleware to update a contact of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const updateContact = async (req, res) => {
  try {
    const { _id, firstname, lastname, company, connection, email, mobile } =
      req.body;
    const { organisation } = res.locals.user;
    const updatedContact = await Contact.findByIdAndUpdate(_id, {
      firstname,
      lastname,
      company,
      connection,
      email,
      mobile,
    });
    if (connection === "customer") {
      updateStats(organisation);
    }

    res.status(200).json({ success: true, updatedContact });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (DELETE OPERATION)
 * Middleware to delete a contact of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const deleteContact = async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
