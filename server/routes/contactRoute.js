import express from "express";
import {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// [GET] API
// ([BASE_URL]/api/contact/)
// Requires User Authorisation.
// Endpoint to retrieve all contacts of an organisation.
router.get("/", authorize, getAllContacts);

// [POST] API
// ([BASE_URL]/api/contact/)
// Requires User Authorisation.
// Endpoint to create a contact for an organisation.
router.post("/", authorize, createContact);

// [PATCH] API
// ([BASE_URL]/api/contact/[CONTACT_ID])
// Requires User Authorisation.
// Endpoint to update a contact of an organisation.
router.patch("/:id", authorize, updateContact);

// [DELETE] API
// ([BASE_URL]/api/contact/[CONTACT_ID])
// Requires User Authorisation.
// Endpoint to delete a contact of an organisation.
router.delete("/:id", authorize, deleteContact);

export default router;
