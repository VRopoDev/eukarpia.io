import express from "express";
import { getStats } from "../controllers/statController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// [GET] API
// ([BASE_URL]/api/stat/overview)
// Requires User Authorisation.
// Endpoint to get an overview of sales and units sold of an organisation.
router.get("/overview", authorize, getStats);

// [GET] API
// ([BASE_URL]/api/stat/daily)
// Requires User Authorisation.
// Endpoint to get sales and units sold daily of an organisation.
router.get("/daily", authorize, getStats);

// [GET] API
// ([BASE_URL]/api/stat/breakdown)
// Requires User Authorisation.
// Endpoint to get sales by product of an organisation.
router.get("/breakdown", authorize, getStats);

export default router;
