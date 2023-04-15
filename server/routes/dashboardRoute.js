import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// [GET] API
// ([BASE_URL]/api/dashboard/)
// Requires User Authorisation.
// Endpoint to retrieve analytics for the dashboard page.
router.get("/", authorize, getDashboardStats);

export default router;
