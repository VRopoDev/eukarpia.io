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

// [GET] API
// ([BASE_URL]/api/user/)
// Requires User Authorisation.
// Endpoint to get all users of an organisation.
router.get("/", authorize, getAllOrgUsers);

// [GET] API
// ([BASE_URL]/api/user/[USER_ID])
// Requires User Authorisation.
// Endpoint to get a user by id.
router.get("/:id", authorize, getOrgUser);

// [POST] API
// ([BASE_URL]/api/user/)
// Requires User Authorisation.
// Endpoint to create a new user for an organisation.
router.post("/", authorize, createOrgUser);

// [POST] API
// ([BASE_URL]/api/user/register/)
// Endpoint to register a new user (creates a new organisation).
router.post("/register", userRegister);

// [POST] API
// ([BASE_URL]/api/user/login/)
// Authenticates the user and returns the JWT.
// Endpoint to login a registered user.
router.post("/login", userLogin);

// [POST] API
// ([BASE_URL]/api/user/[USER_ID/re-auth/)
// Endpoint to refresh a user's JWT.
router.post("/:id/re-auth", reAuthUser);

// [POST] API
// ([BASE_URL]/api/user/[USER_ID/logout/)
// Endpoint to logout a user.
router.post("/:id/logout", userLogout);

// [POST] API
// ([BASE_URL]/api/user/forgot-password/)
// Endpoint to create a user password reset link.
router.post("/forgot-password", forgotPassword);

// [PATCH] API
// ([BASE_URL]/api/user/[USER_ID]/)
// Requires User Authorisation.
// Endpoint to update a user of an organisation.
router.patch("/:id", authorize, updateOrgUser);

// [PATCH] API
// ([BASE_URL]/api/user/[USER_ID]/reset-pass/[RESET_SECRET]/)
// Endpoint to update a users password from the reset link.
router.patch(`/:id/reset-pass/:resetSecret`, updateUserPass);

// [DELETE] API
// ([BASE_URL]/api/user/[USER_ID]/)
// Requires User Authorisation.
// Endpoint to delete a user from an organisation.
// IMPORTANT: If only one organisation users, the operation is not allowed.
router.delete("/:id", authorize, deleteOrgUser);

export default router;
