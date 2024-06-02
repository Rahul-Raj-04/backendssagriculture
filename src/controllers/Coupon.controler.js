import { Coupon } from "../models/Coupon.model.js";
import { ApiError } from "../utils/ApiError.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const createCoupon = asyncHandler(async (req, res) => {
  // Get coupon details from frontend
  const { title, code, numberOfTimes, discount, status } = req.body;

  // Validation - Check if required fields are not empty
  if ([title, code, discount].some((field) => !field)) {
    throw new ApiError(400, "Title, code, and discount are required");
  }

  // Check if coupon with the same code already exists
  const existingCoupon = await Coupon.findOne({ code });

  if (existingCoupon) {
    throw new ApiError(409, "Coupon with the same code already exists");
  }

  // Create the coupon object
  const coupon = await Coupon.create({
    title,
    code,
    numberOfTimes: numberOfTimes || 0, // Default numberOfTimes to 0 if not provided
    discount,
    status: status || "active", // Default status to 'active' if not provided
  });

  // Check for coupon creation
  if (!coupon) {
    throw new ApiError(500, "Something went wrong while creating the coupon");
  }

  return res.status(201).json({
    success: true,
    data: coupon,
    message: "Coupon created successfully",
  });
});
const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Check if coupon exists
  const coupon = await Coupon.findById(id);
  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  // Delete the coupon
  await Coupon.findByIdAndDelete(id);

  return res.json({
    success: true,
    message: "Coupon deleted successfully",
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  // Fetch all coupons
  const coupons = await Coupon.find();

  return res.json({
    success: true,
    data: coupons,
  });
});
const editCoupon = asyncHandler(async (req, res) => {
  // Get coupon details from frontend
  const { id, title, code, numberOfTimes, discount, status } = req.body;

  // Validation - Check if required fields are not empty
  if (![id, title, code, discount].every((field) => field)) {
    throw new ApiError(400, "ID, title, code, and discount are required");
  }

  // Find the coupon by ID
  const existingCoupon = await Coupon.findById(id);

  if (!existingCoupon) {
    throw new ApiError(404, "Coupon not found");
  }

  // Update coupon details
  existingCoupon.title = title;
  existingCoupon.code = code;
  existingCoupon.numberOfTimes = numberOfTimes;
  existingCoupon.discount = discount;
  existingCoupon.status = status || "active";

  // Save the updated coupon
  const updatedCoupon = await existingCoupon.save();

  // Check for coupon update
  if (!updatedCoupon) {
    throw new ApiError(500, "Something went wrong while updating the coupon");
  }

  return res.status(200).json({
    success: true,
    data: updatedCoupon,
    message: "Coupon updated successfully",
  });
});

export { createCoupon, deleteCoupon, getCoupons, editCoupon };
