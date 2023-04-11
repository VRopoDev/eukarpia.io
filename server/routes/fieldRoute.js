import express from "express";
import {
  getAllFields,
  getAllProducts,
  createField,
  updateField,
  deleteField,
} from "../controllers/fieldController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

/* [GET] Endpoint to retrieve all field of an organisation */
router.get("/", authorize, getAllFields);

/* [GET] Endpoint to retrieve all products of an organisation */
router.get("/products", authorize, getAllProducts);

/* [POST] Endpoint to create a field for an organisation */
router.post("/", authorize, createField);

/* [PATCH] Endpoint to update a field of an organisation */
router.patch("/:id", authorize, updateField);

/* [DELETE] Endpoint to delete a field of an organisation */
router.delete("/:id", authorize, deleteField);

export default router;
