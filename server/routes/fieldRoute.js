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

// [GET] API
// ([BASE_URL]/api/field/)
// Requires User Authorisation.
// Endpoint to retrieve all field of an organisation.
router.get("/", authorize, getAllFields);

// [GET] API
// ([BASE_URL]/api/field/products)
// Requires User Authorisation.
// Endpoint to retrieve all products of an organisation.
router.get("/products", authorize, getAllProducts);

// [POST] API
// ([BASE_URL]/api/field/)
// Requires User Authorisation.
// Endpoint to create a field for an organisation.
router.post("/", authorize, createField);

// [PATCH] API
// ([BASE_URL]/api/field/[FIELD_ID])
// Requires User Authorisation.
// Endpoint to update a field of an organisation.
router.patch("/:id", authorize, updateField);

// [DELETE] API
// ([BASE_URL]/api/field/[FIELD_ID])
// Requires User Authorisation.
// Endpoint to delete a field of an organisation.
router.delete("/:id", authorize, deleteField);

export default router;
