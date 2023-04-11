import mongoose from "mongoose";
import Joi from "joi";

/**
 * Helper function to validate users registration data.
 * @param {Object} data all user details
 * @returns true if valid data false otherwise with error message.
 */
export const userValidation = (data) => {
  const schemaValidation = Joi.object({
    firstname: Joi.string().required().min(3).max(256),
    lastname: Joi.string().required().min(3).max(256),
    email: Joi.string().required().min(6).max(256).email(),
    password: Joi.string().required().min(6).max(1024),
    mobile: Joi.string().min(11).max(15),
  });

  return schemaValidation.validate(data);
};

/**
 * Helper function to validate users login data.
 * @param {Object} data login data, email and password.
 * @returns true if valid data false otherwise with error message.
 */
export const loginValidation = (data) => {
  const schemaValidation = Joi.object({
    email: Joi.string().required().min(6).max(256).email(),
    password: Joi.string().required().min(6).max(1024),
  });

  return schemaValidation.validate(data);
};

/**
 * Helper function to validate if a string is a valid
 * objectId for mongoose.
 * @param {String} id
 * @returns true if valid false otherwise.
 */
export const objectIdValidation = (id) => {
  return mongoose.isValidObjectId(id);
};
