import express from "express";
import {
  getAllDevices,
  getAllIoT,
  createDevice,
  updateDevice,
  deleteDevice,
  getAllCommands,
  sendCommand,
  createCommand,
  updateCommand,
  deleteCommand,
} from "../controllers/deviceController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// [GET] API
// ([BASE_URL]/api/device/)
// Requires User Authorisation.
// Endpoint to retrieve all devices of an organisation.
router.get("/", authorize, getAllDevices);

// [GET] API
// ([BASE_URL]/api/device/iot/)
// Requires User Authorisation.
// Endpoint to retrieve all devices communications of an organisation.
router.get("/iot", authorize, getAllIoT);

// [POST] API
// ([BASE_URL]/api/device/)
// Requires User Authorisation.
// Endpoint to create a device for an organisation.
router.post("/", authorize, createDevice);

// [PATCH] API
// ([BASE_URL]/api/device/[DEVICE_ID]/)
// Requires User Authorisation.
// Endpoint to update a device of an organisation.
router.patch("/:id", authorize, updateDevice);

// [DELETE] API
// ([BASE_URL]/api/device/[DEVICE_ID]/)
// Requires User Authorisation.
// Endpoint to delete a device of an organisation.
router.delete("/:id", authorize, deleteDevice);

// ---------------IoT Devices Commands------------------------------------ //

// [GET] API
// ([BASE_URL]/api/device/command/)
// Requires User Authorisation.
// Endpoint to retrieve all device commands of an organisation.
router.get("/command", authorize, getAllCommands);

// [POST] API
// ([BASE_URL]/api/device/send-command/[COMMAND_ID]/)
// Requires User Authorisation.
// Endpoint to send a command to an IoT device of an organisation.
router.post("/send-command/:id", authorize, sendCommand);

// [POST] API
// ([BASE_URL]/api/device/command)
// Requires User Authorisation.
// Endpoint to create a device command for an organisation.
router.post("/command", authorize, createCommand);

// [PATCH] API
// ([BASE_URL]/api/device/command/[COMMAND_ID]/)
// Requires User Authorisation.
// Endpoint to update a device command of an organisation.
router.patch("/command/:id", authorize, updateCommand);

// [DELETE] API
// ([BASE_URL]/api/device/command/[COMMAND_ID]/)
// Requires User Authorisation.
// Endpoint to delete a device command of an organisation.
router.delete("/command/:id", authorize, deleteCommand);

export default router;
