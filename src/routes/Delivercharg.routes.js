import { Router } from "express";
import {
  createDeliveryCharge,
  deleteDeliveryCharge,
  getAllDeliveryCharges,
} from "../controllers/deliverycharg.controler.js";

const router = Router();
router.route("/add").post(createDeliveryCharge);
router.route("/all").get(getAllDeliveryCharges);
router.route("/delete").delete(deleteDeliveryCharge);

export default router;
