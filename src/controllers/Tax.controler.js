import { asyncHandler } from "../utils/asyncHandler.js";
import { Tax } from "../models/Tax.model.js";
import { ApiError } from "../utils/ApiError.js";
const createTax = asyncHandler(async (req, res) => {
  // Get tax details from frontend
  const { taxTitle, taxPercentage, status } = req.body;

  // Validation - Check if required fields are not empty
  if ([taxTitle, taxPercentage].some((field) => !field)) {
    throw new ApiError(400, "Tax title and percentage are required");
  }

  // Check if tax with the same title already exists
  const existingTax = await Tax.findOne({ taxTitle });

  if (existingTax) {
    throw new ApiError(409, "Tax with the same title already exists");
  }

  // Create the tax object
  const tax = await Tax.create({
    taxTitle,
    taxPercentage,
    status: status || "active", // Default status to 'active' if not provided
  });

  // Check for tax creation
  if (!tax) {
    throw new ApiError(500, "Something went wrong while creating the tax");
  }

  return res.status(201).json({
    success: true,
    data: tax,
    message: "Tax created successfully",
  });
});
const deleteTax = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    throw new ApiError(400, "Tax ID is required");
  }

  const deletedTax = await Tax.findByIdAndDelete(id);

  if (!deletedTax) {
    throw new ApiError(404, "Tax not found");
  }

  return res.status(200).json({
    success: true,
    data: deletedTax,
    message: "Tax deleted successfully",
  });
});
const getAllTaxes = asyncHandler(async (req, res) => {
  // Fetch all tax records from the database
  const taxes = await Tax.find();

  // Check if taxes exist
  if (!taxes || taxes.length === 0) {
    throw new ApiError(404, "No taxes found");
  }

  // Send a successful response with the list of taxes
  return res.status(200).json({
    success: true,
    data: taxes,
    message: "Taxes retrieved successfully",
  });
});

const updateTax = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const { taxTitle, taxPercentage, status } = req.body;

  if ([taxTitle, taxPercentage].some((field) => !field)) {
    throw new ApiError(400, "Tax title and percentage are required");
  }

  const existingTax = await Tax.findById(id);

  if (!existingTax) {
    throw new ApiError(404, "Tax not found");
  }

  existingTax.taxTitle = taxTitle;
  existingTax.taxPercentage = taxPercentage;
  existingTax.status = status || "active";

  const updatedTax = await existingTax.save();

  if (!updatedTax) {
    throw new ApiError(500, "Something went wrong while updating the tax");
  }

  return res.status(200).json({
    success: true,
    data: updatedTax,
    message: "Tax updated successfully",
  });
});

export { createTax, deleteTax, getAllTaxes, updateTax };
