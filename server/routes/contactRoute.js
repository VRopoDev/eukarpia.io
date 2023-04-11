import express from "express";
import {
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contactController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

/* [GET] Endpoint to retrieve all contacts of an organisation */
router.get("/", authorize, getAllContacts);

/* [POST] Endpoint to create a contact for an organisation */
router.post("/", authorize, createContact);

/* [PATCH] Endpoint to update a contact of an organisation */
router.patch("/:id", authorize, updateContact);

/* [DELETE] Endpoint to delete a contact of an organisation */
router.delete("/:id", authorize, deleteContact);

export default router;
