import express from "express";
import {
  getAllTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

/* [GET] Endpoint to retrieve all transactions of an organisation */
router.get("/", authorize, getAllTransactions);

/* [POST] Endpoint to create a transaction for an organisation */
router.post("/", authorize, createTransaction);

/* [PATCH] Endpoint to update a transaction of an organisation */
router.patch("/:id", authorize, updateTransaction);

/* [DELETE] Endpoint to delete a transaction of an organisation */
router.delete("/:id", authorize, deleteTransaction);

export default router;
