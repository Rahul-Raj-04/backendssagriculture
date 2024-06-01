import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from "../controllers/Category.controler.js";
import { upload } from "../middlewares/FileUpload.middlwares.js";

const router = Router();
router.route("/add").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  createCategory
);
router.route("/delete").delete(deleteCategory);
router.route("/allcategory").get(getAllCategories);
export default router;
