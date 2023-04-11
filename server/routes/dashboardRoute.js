import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authorize, getDashboardStats);

export default router;
