import express from "express";
import { insertIoT } from "../controllers/thirdPartyController.js";

const router = express.Router();

// [POST] API
// ([BASE_URL]/api/third-party/v1/iot/)
// This is version 1 of the API.
// Requires User Authorisation.
// Endpoint to send a device commnunication for an organisation.
router.post("/v1/iot", insertIoT);

export default router;
