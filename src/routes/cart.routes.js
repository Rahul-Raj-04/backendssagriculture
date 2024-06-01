import { Router } from "express";
import { addToCart } from "../controllers/Cart.controler.js";


const router = Router()
router.route("/add").post(addToCart);
export default router;