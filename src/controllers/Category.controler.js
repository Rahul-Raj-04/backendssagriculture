import connectDB from "../db/index.js";
import { Category } from "../models/Category.model.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const createCategory = async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const { title, slug, metaKeywords, metaDescription } = req.body;

    if (
      ![title, slug, metaKeywords, metaDescription].every((field) =>
        field?.trim()
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existingCategory = await Category.findOne({
      $or: [{ title }, { slug }],
    });
    if (existingCategory) {
      throw new ApiError(
        409,
        "Category with the same title or slug already exists"
      );
    }

    const avatarLocalPath = req.files?.avatar[0].path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    const avatarImage = await uploadOnCloudinary(avatarLocalPath);
    if (!avatarImage) {
      throw new ApiError(400, "Failed to upload avatar image");
    }

    const category = await Category.create({
      title,
      slug,
      metaKeywords,
      metaDescription,
      avatar: avatarImage.url,
    });

    const { _id: _, ...createdCategory } = category.toObject();

    return res
      .status(201)
      .json(
        new ApiResponse(200, createdCategory, "Category created successfully")
      );
  } catch (error) {
    console.error("Error during category creation:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const updateCategory = async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const categoryId = req.body;

    const { title, slug, metaKeywords, metaDescription } = req.body;

    if (
      ![title, slug, metaKeywords, metaDescription].every((field) =>
        field?.trim()
      )
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existingCategory = await Category.findOne({
      $and: [{ _id: { $ne: categoryId } }, { $or: [{ title }, { slug }] }],
    });
    if (existingCategory) {
      throw new ApiError(
        409,
        "Category with the same title or slug already exists"
      );
    }

    const category = await Category.findByIdAndUpdate(
      categoryId,
      {
        title,
        slug,
        metaKeywords,
        metaDescription,
      },
      { new: true }
    );

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, category, "Category updated successfully"));
  } catch (error) {
    console.error("Error during category update:", error);

    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({ success: false, message: error.message });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.query;

  // Check if category exists
  const category = await Category.findById(id);
  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  // Delete the category
  await Category.findByIdAndDelete(id);

  return res.json({
    success: true,
    message: "Category deleted successfully",
  });
});
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  return res.json({
    success: true,
    data: categories,
  });
});

export { createCategory, deleteCategory, updateCategory, getAllCategories };
