import { Router } from "express";
import {
  getAdminDetails,
  loginAdmin,
  logoutAdmin,
  updateAdmin,
} from "../controllers/Admin.controler.js";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/logout").post(logoutAdmin);
router.route("/Profile").get(getAdminDetails);
router.route("/update").patch(updateAdmin);

export default router;
