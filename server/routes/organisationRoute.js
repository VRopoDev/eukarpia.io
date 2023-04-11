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

/** [GET] Endpoint to get an authorised user's organisation */
router.get("/", authorize, getOrg);

/** [GET] Endpoint to get an authorised user's organisation all notifications */
router.get("/notification", authorize, getOrgNotifications);

/** [PATCH] Endpoint to update an authorised user's organisation */
router.patch("/", authorize, updateOrg);

/** [DELETE] Endpoint to delete an organisation */
router.delete("/", authorize, deleteOrg);

/** [DELETE] Endpoint to delete notifications of an organisation */
router.delete("/notification/:id", authorize, deleteOrgNotification);

export default router;
