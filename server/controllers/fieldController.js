import Field from "../models/Field.js";
import User from "../models/User.js";

/**
 * (READ OPERATION)
 * Middleware to get all fields of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const getAllFields = async (req, res) => {
  try {
    const { organisation } = res.locals.user;
    const fields = await Field.find({
      organisation: organisation,
    });
    res.status(200).json(fields);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (READ OPERATION)
 * Middleware to get all products of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const getAllProducts = async (req, res) => {
  try {
    const { organisation } = res.locals.user;
    const fields = await Field.find({
      organisation: organisation,
    })
      .lean()
      .exec();

    const products = fields.map((field) => {
      return {
        fieldname: field.name,
        product: field.product,
        supply: field.supply,
      };
    });
    res.status(200).json(products);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (CREATE OPERATION)
 * Middleware to create a field for an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const createField = async (req, res) => {
  try {
    const { userId, organisation } = res.locals.user;
    const data = req.body;
    data.organisation = organisation;
    const user = await User.findById(userId);
    data.createdBy = `${user.firstname} ${user.lastname}`;
    const field = new Field(data);
    const newField = await field.save();
    res.status(200).json({ success: true, newField });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (UPDATE OPERATION)
 * Middleware to update a field of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const updateField = async (req, res) => {
  try {
    const { _id } = req.body;
    const updatedField = await Field.findByIdAndUpdate(_id, req.body);

    res.status(200).json({ success: true, updatedField });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (DELETE OPERATION)
 * Middleware to delete a field of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 */
export const deleteField = async (req, res) => {
  try {
    await Field.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
