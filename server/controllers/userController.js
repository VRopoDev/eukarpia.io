import User from "../models/User.js";
import Organisation from "../models/Organisation.js";
import bcrypt from "bcrypt";
import { generateAuthToken, destroyToken } from "../middleware/auth.js";
import {
  userValidation,
  loginValidation,
  objectIdValidation,
} from "../helpers/validate.js";

/**
 *  Heleper function to encrypt a password.
 * @param {String} psw the password to encypt
 * @returns validation the hashed password.
 */
async function encrypt(psw) {
  const salt = await bcrypt.genSalt(5);
  const hashed = await bcrypt.hash(psw, salt);
  return hashed;
}

/**
 *  Heleper function to decrypt password and validate.
 * @param {String} psw the input password to test
 * @param {String} epsw stored hashed password
 * @returns true if valid password false otherwise.
 */
async function decrypt(psw, epsw) {
  const valid = await bcrypt.compare(psw, epsw);
  return valid;
}

/**
 * (CREATE OPERATION)
 * Middleware to register a new user.
 * @param {*} req the request
 * @param {*} res the response
 * @returns validation errors or saved user
 */
export const userRegister = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.toLowerCase();

    // Validate input date for user registration
    const { error } = userValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error["details"][0]["message"] });
    }

    // Validate if user already exists.
    const userExists = await User.findOne({
      $or: [{ email: email }],
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists!" });
    }

    // When a user is registered to the platform we need to create an organisation.
    const latestOrg = await Organisation.find()
      .sort({ orgId: -1 })
      .limit(1)
      .lean()
      .exec();
    const newOrgId = latestOrg[0]?.orgId + 1 || 100;
    const newOrg = new Organisation({
      orgId: newOrgId,
      orgName: req.body.organisation || "",
    });
    const createdOrg = await newOrg.save();

    // Encrypt the password for the database and save new user.
    const hashedPass = await encrypt(password);

    // Create the new user in the database.
    const user = new User(req.body);
    user.password = hashedPass;
    user.organisation = createdOrg._id;
    await user.save();

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (UPDATE OPERATION)
 * Middleware to login a user.
 * @param {*} req the request
 * @param {*} res the response
 * @returns validation errors or a signed oauth2 token.
 */
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input data for user login.
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error["details"][0]["message"] });
    }

    // Validate if user exists in the database.
    const userExists = await User.findOne({ email: email })
      .populate("organisation")
      .lean()
      .exec();

    if (!userExists) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Validate if decrypted password matches the input.
    const validPass = await decrypt(password, userExists.password);

    if (!validPass) {
      return res.status(400).json({ error: "Email or password is wrong!" });
    }

    // Sign a token and log the user in.
    const token = generateAuthToken(userExists);

    const user = {
      _id: userExists._id,
      firstname: userExists.firstname,
      lastname: userExists.lastname,
      email: userExists.email,
      mobile: userExists.mobile || "",
      role: userExists.role,
      organisationId: userExists.organisation.orgId,
      organisationName: userExists.organisation.orgName,
    };

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * (UPDATE OPERATION)
 * Middleware to refresh a user's token.
 * @param {*} req the request
 * @param {*} res the response
 * @returns validation errors or a signed oauth2 token.
 */
export const reAuthUser = async (req, res) => {
  // Validate if user exists in the database.
  const userExists = await User.findOne({ _id: req.params.id });

  if (!userExists) {
    return res.status(400).json({ error: "User not found!" });
  }

  // Sign a token and log the user in.
  token = generateAuthToken(userExists);

  res.header("auth-token", token).json({ error: "New token generated!" });
};

/**
 * (UPDATE OPERATION)
 * Middleware to logout a user.
 * @param {*} req the request
 * @param {*} res the response
 * @returns validation errors or a success message.
 */
export const userLogout = async (req, res) => {
  try {
    // Validate user id
    const validId = objectIdValidation(req.params.id);
    if (!validId) {
      return res.status(400).json({ error: "Not valid user id!" });
    }

    // Validate if user found.
    const user = await User.findById(req.params.id);
    if (!user || user._id.toString() !== req.header("user")) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Logout the user
    const logoutMsg = destroyToken(req.header("auth-token"));
    if (logoutMsg.error) {
      return res.status(400).json({ error: logoutMsg.error });
    }
    res.status(200).json({ error: logoutMsg.message });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
};

/**
 * (READ OPERATION)
 * Middleware to get all users (possible admin level).
 * @param {*} req the request
 * @param {*} res the response
 */
export const getAllOrgUsers = async (req, res) => {
  try {
    const { organisation } = res.locals.user;
    const users = await User.find({ organisation: organisation }).select({
      firstname: 1,
      lastname: 1,
      email: 1,
      mobile: 1,
      role: 1,
    });
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
};

/**
 * (READ OPERATION)
 * Middleware to get a user of an organisation by id.
 * @param {*} req the request
 * @param {*} res the response
 * @returns validation errors or the queried user.
 */
export const getOrgUser = async (req, res) => {
  // Validate user id
  const validId = objectIdValidation(req.params.id);
  if (!validId) {
    return res.status(400).json({ error: "Not valid user id!" });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(400)
        .json({ error: "No user found with the queried id!" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
};

/**
 * (READ OPERATION)
 * Middleware to get a password reset link.
 * [Note] The link is returned as no email server yet.
 * @param {*} req the request
 * @param {*} res the response
 * @returns validation errors or the reset link (normally will just return a message).
 */
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // For security we return a 200 status to not inform that the email was incorect.
      // The front-end could say something like: if the email exists we will email you the link.
      return res.status(200).json({ error: "No email to send" });
    }
    const resetLink = `http://localhost:8080/api/user/${user._id}/reset-pass/${process.env.RESET_SECRET}`;
    res.status(200).json({ link: resetLink });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
};

/**
 * Middleware to create user for an organisation.
 * @param {*} req the request
 * @param {*} res the response
 * @returns validation errors or the new user.
 */
export const createOrgUser = async (req, res) => {
  try {
    const { organisation } = res.locals.user;
    const { password, role } = req.body;
    const data = req.body;
    const email = req.body.email?.toLowerCase();
    delete data.role;

    // Validate input date for user registration
    const { error } = userValidation(req.body);
    if (error) {
      return res.status(400).json({ error: error["details"][0]["message"] });
    }

    // Validate if user already exists.
    const userExists = await User.findOne({
      $or: [{ email: email }],
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists!" });
    }

    // Encrypt the password for the database and save new user.
    const hashedPass = await encrypt(password);

    // Create the new user in the database.
    const newUser = new User(req.body);
    newUser.password = hashedPass;
    newUser.role = role;
    newUser.organisation = organisation;
    await newUser.save();

    res.status(200).json({ success: true, newUser });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * (UPDATE OPERATION)
 * Middleware to update a user data of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 * @returns validation errors or the updated user.
 */
export const updateOrgUser = async (req, res) => {
  try {
    const { organisation } = res.locals.user;
    // Validate if there are values to update
    if (!req.body) {
      return res.status(400).json({ error: "No values to update!" });
    }
    // Validate user id
    const validId = objectIdValidation(req.params.id);
    if (!validId) {
      return res.status(400).json({ error: "Not valid user id!" });
    }

    let user = await User.findById(req.params.id)
      .select({
        firstname: 1,
        lastname: 1,
        email: 1,
        password: 1,
        role: 1,
        organisation: 1,
      })
      .lean()
      .exec();

    // Validate if user making the request is from organisation.
    if (!user || user.organisation.toString() !== organisation) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Validate user data
    let encryptFlag = req.body.password ? true : false;
    for (const [key, value] of Object.entries(req.body)) {
      if (value && value !== "") user[key] = value;
    }

    // Validate the user data
    delete user._id;
    delete user.organisation;
    delete user.role;
    const { error } = userValidation(user);
    if (error) {
      return res.status(400).json({ error: error["details"][0]["message"] });
    }

    // Encrypt the new password before saving.
    if (encryptFlag) {
      user.password = await encrypt(user.password);
    }

    // Update the user in the database
    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      {
        firstname: user.firstname,
        lastname: user.lastname,
        password: user.password,
        email: user.email,
        mobile: user.mobile || "",
        role: req.body.role,
      }
    );
    res.status(200).json({ success: true, updatedUser });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
};

/**
 * (UPDATE OPERATION)
 * Middleware to update a users password without login.
 * @param {*} req the request
 * @param {*} res the response
 * @returns validation errors or the updated user.
 */
export const updateUserPass = async (req, res) => {
  // Validate if there are values to update
  if (!req.body) {
    return res.status(400).json({ error: "No values to update!" });
  }
  // Validate user id
  const validId = objectIdValidation(req.params.id);
  if (!validId) {
    return res.status(400).json({ error: "Not valid user id!" });
  }

  // Validate if user making the request is the one to delete.
  let user = await User.findById(req.params.id)
    .select({
      _id: 1,
      firstname: 1,
      lastname: 1,
      email: 1,
      password: 1,
    })
    .lean()
    .exec();

  if (!user) {
    return res.status(400).json({ error: "User not found!" });
  }

  // Validate user data
  user.password = req.body.password;
  delete user._id; // delete the _id for validation of data
  const { error } = userValidation(user);
  if (error) {
    return res.status(400).json({ error: error["details"][0]["message"] });
  }

  // Encrypt the new password before saving.
  user.password = await encrypt(user.password);

  // Update the user's password in the database
  try {
    const updatedUser = await User.updateOne(
      { _id: req.params.id },
      {
        password: user.password,
      }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
};

/**
 * (DELETE OPERATION)
 * Middleware to delete a user of an organisation.
 * @param {*} req the request
 * @param {*} res the response
 * @returns validation errors or the deleted user.
 */
export const deleteOrgUser = async (req, res) => {
  try {
    const { organisation } = res.locals.user;

    // Validate if last user left
    const users = await User.countDocuments({ organisation: organisation });
    if (users === 1) {
      return res.status(400).json({
        error:
          "You are not allowed to delete the last user of the organisation!",
      });
    }

    // Validate user id
    const validId = objectIdValidation(req.params.id);
    if (!validId) {
      return res.status(400).json({ error: "Not valid user id!" });
    }

    // Validate if user making the call is from organisation.
    const user = await User.findById(req.params.id);
    if (!user || user.organisation.toString() !== organisation) {
      return res.status(400).json({ error: "User not found!" });
    }

    // Delete the user from the database.
    const deletedUser = await User.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.toString() });
  }
};
