import { Category } from "../models/Category.model.js";
import { Product } from "../models/Product.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addProduct = async (req, res) => {
  try {
    if (!req.body) {
      throw new ApiError(400, "Request body is missing or empty");
    }

    const {
      productTitle,
      description,
      oneTimePrice,
      subscriptionPrice,
      categoryId,
      productShortDescription,
      discountPercentage,
      rating,
      stock,
      status,
      visibility,
      productTags,
    } = req.body;

    if (
      ![
        productTitle,
        description,
        oneTimePrice,
        subscriptionPrice,
        categoryId,
        productShortDescription,
        discountPercentage,
        rating,
        stock,
        status,
        visibility,
        productTags,
      ].every((field) => field?.trim())
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const existingProduct = await Product.findOne({ productTitle });
    if (existingProduct) {
      throw new ApiError(409, "Product with the same title already exists");
    }

    // Fetch the category by ID
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const imageLocalPath = req.files?.image[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!imageLocalPath || !thumbnailLocalPath) {
      throw new ApiError(400, "Image and Thumbnail files are required");
    }

    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!uploadedImage || !uploadedThumbnail) {
      throw new ApiError(400, "Failed to upload image or thumbnail");
    }

    const newProduct = await Product.create({
      productTitle,
      image: uploadedImage.url,
      thumbnail: uploadedThumbnail.url,
      description,
      oneTimePrice,
      subscriptionPrice,
      discountPercentage,
      rating,
      stock,
      category: category.title,
      status,
      visibility,
      productTags,
      productShortDescription,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: {
        ...newProduct.toObject(), // Convert Mongoose object to plain object
        category: category.title, // Include category name instead of ID
      },
    });
  } catch (error) {
    console.error("Error during product creation:", error);

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

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.query; // Assuming the product ID is passed in the URL parameter

  // Check if product exists
  const product = await Product.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // Delete the product
  await Product.findByIdAndDelete(id);

  return res.json({
    success: true,
    message: "Product deleted successfully",
  });
});

const getAllProducts = asyncHandler(async (req, res) => {
  // Retrieve all products
  const products = await Product.find();
  return res.json({
    success: true,
    data: products,
    message: "All products retrieved successfully",
  });
});
const getSingleProduct = asyncHandler(async (req, res) => {
  const { id } = req.query; // Assuming the product ID is passed in the URL parameter

  // Find the product by ID
  const product = await Product.findById(id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  return res.json({
    success: true,
    data: product,
    message: "Product retrieved successfully",
  });
});
const updateProduct = asyncHandler(async (req, res) => {
  const {
    id,
    productTitle,
    description,
    oneTimePrice,
    subscriptionPrice,
    categoryId,
    productShortDescription,
    discountPercentage,
    rating,
    stock,
    status,
    visibility,
    productTags,
  } = req.body;

  // Check if ID is provided
  if (!id) {
    throw new ApiError(400, "Product ID is required");
  }

  const updateFields = {};

  // List of fields to update
  const fieldsToUpdate = [
    "productTitle",
    "description",
    "oneTimePrice",
    "subscriptionPrice",
    "categoryId",
    "productShortDescription",
    "discountPercentage",
    "rating",
    "stock",
    "status",
    "visibility",
    "productTags",
  ];

  // Iterate over fields and add to updateFields if provided
  fieldsToUpdate.forEach((field) => {
    if (req.body[field]) {
      updateFields[field] = req.body[field];
    }
  });

  // If images are being updated
  const imageLocalPath = req.files?.image?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (imageLocalPath && thumbnailLocalPath) {
    const uploadedImage = await uploadOnCloudinary(imageLocalPath);
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!uploadedImage || !uploadedThumbnail) {
      throw new ApiError(400, "Failed to upload image or thumbnail");
    }

    updateFields.image = uploadedImage.url;
    updateFields.thumbnail = uploadedThumbnail.url;
  }

  // Find and update the product
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedProduct) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedProduct, "Product updated successfully"));
});

export {
  addProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
};
