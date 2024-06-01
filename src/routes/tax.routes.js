import { Router } from "express";
import {
  createTax,
  deleteTax,
  getAllTaxes,
  updateTax,
} from "../controllers/Tax.controler.js";

const router = Router();
router.route("/add").post(createTax);
router.route("/delete").delete(deleteTax);
router.route("/alltax").get(getAllTaxes);
router.route("/update").patch(updateTax);
export default router;
