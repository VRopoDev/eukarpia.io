import express from "express";
import { insertIoT } from "../controllers/thirdPartyController.js";

const router = express.Router();

/* [POST] Endpoint to create a device commnunication for an organisation */
router.post("/v1/iot", insertIoT);

export default router;
