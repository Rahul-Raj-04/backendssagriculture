import { Router } from "express";
import { addToCart, getCart } from "../controllers/Cart.controler.js";
import { verifyJWT } from "../middlewares/auth.middlwares.js";

const router = Router();
router.route("/add").post(verifyJWT, addToCart);
router.route("/product").get(verifyJWT, getCart);
export default router;
