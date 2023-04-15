import express from "express";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

// [GET] API
// ([BASE_URL]/api/transaction/)
// Requires User Authorisation.
// Endpoint to retrieve all transactions of an organisation.
router.get("/", authorize, getAllTransactions);

// [POST] API
// ([BASE_URL]/api/transaction/)
// Requires User Authorisation.
// Endpoint to create a transaction for an organisation.
router.post("/", authorize, createTransaction);

// [PATCH] API
// ([BASE_URL]/api/transaction/[TRANSACTION_ID])
// Requires User Authorisation.
// Endpoint to update a transaction of an organisation.
router.patch("/:id", authorize, updateTransaction);

// [DELETE] API
// ([BASE_URL]/api/transaction/[TRANSACTION_ID])
// Requires User Authorisation.
// Endpoint to delete a transaction of an organisation.
router.delete("/:id", authorize, deleteTransaction);

export default router;
