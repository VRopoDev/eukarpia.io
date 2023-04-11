import express from "express";
import {
  userRegister,
  userLogin,
  getAllOrgUsers,
  getOrgUser,
  createOrgUser,
  updateOrgUser,
  deleteOrgUser,
  userLogout,
  updateUserPass,
  forgotPassword,
  reAuthUser,
} from "../controllers/userController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// [GET] API to get all users of organisation.
router.get("/", authorize, getAllOrgUsers);

// [GE]T API to get a user by id.
router.get("/:id", authorize, getOrgUser);

// [POST] API to create a new user for an organisation.
router.post("/", authorize, createOrgUser);

// [POST] API to register a new user (creates new organisation).
router.post("/register", userRegister);

// [POST] API to login a user.
router.post("/login", userLogin);

// POST API to reauthenticate a user.
router.post("/:id/re-auth", reAuthUser);

// [POST] API to logout a user.
router.post("/:id/logout", userLogout);

// [GET] API to get a user password reset link.
router.post("/forgot-password", forgotPassword);

// [PATCH] API to update a user of an organisation.
router.patch("/:id", authorize, updateOrgUser);

// [PATCH] API to update a users password
router.patch(`/:id/reset-pass/${process.env.RESET_SECRET}`, updateUserPass);

// [DELETE] API to delete a user from an organisation.
// (If no organisation users left, the organisation and all data will be deleted too)
router.delete("/:id", authorize, deleteOrgUser);

export default router;
