import express from "express";
import {
  getOrg,
  getOrgNotifications,
  updateOrg,
  deleteOrgNotification,
  deleteOrg,
} from "../controllers/organisationController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// [GET]
// ([BASE_URL]/api/organisation/)
// Requires User Authorisation.
// Endpoint to get an authorised user's organisation.
router.get("/", authorize, getOrg);

// [GET] API
// ([BASE_URL]/api/organisation/notification)
// Requires User Authorisation.
// Endpoint to get an authorised user's organisation all notifications.
router.get("/notification", authorize, getOrgNotifications);

// [PATCH] API
// ([BASE_URL]/api/organisation/)
// Requires User Authorisation.
// Endpoint to update an authorised user's organisation.
router.patch("/", authorize, updateOrg);

// [DELETE] API
// ([BASE_URL]/api/organisation/)
// Requires User Authorisation.
// Endpoint to delete an organisation.
// IMPORTANT: Deletes all data of an organisation too.
router.delete("/", authorize, deleteOrg);

// [DELETE] API
// ([BASE_URL]/api/organisation/notification/[NOTIFICATION_ID])
// Requires User Authorisation.
// Endpoint to delete notifications of an organisation.
router.delete("/notification/:id", authorize, deleteOrgNotification);

export default router;
