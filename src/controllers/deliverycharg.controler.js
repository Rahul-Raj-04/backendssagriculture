import { DeliveryCharge } from "../models/Deliverycharg.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Controller function to create a new delivery charge
const createDeliveryCharge = asyncHandler(async (req, res) => {
  // Get delivery charge details from the request body
  const { Title, Price, Status } = req.body;

  // Validation - Check if required fields are not empty
  if (![Title, Price].every((field) => field !== undefined)) {
    throw new ApiError(400, "Title and Price are required");
  }

  // Create the delivery charge object
  const deliveryCharge = await DeliveryCharge.create({
    Title,
    Price,
    Status: Status || "active", // Default status to 'active' if not provided
  });

  // Check for delivery charge creation
  if (!deliveryCharge) {
    throw new ApiError(
      500,
      "Something went wrong while creating the delivery charge"
    );
  }

  return res.status(201).json({
    success: true,
    data: deliveryCharge,
    message: "Delivery charge created successfully",
  });
});

// Controller function to delete a delivery charge
const deleteDeliveryCharge = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Find the delivery charge by ID and delete it
  const deletedDeliveryCharge = await DeliveryCharge.findByIdAndDelete(id);

  // Check if the delivery charge was found and deleted
  if (!deletedDeliveryCharge) {
    throw new ApiError(404, "Delivery charge not found");
  }

  return res.status(200).json({
    success: true,
    data: deletedDeliveryCharge,
    message: "Delivery charge deleted successfully",
  });
});

// Controller function to get all delivery charges
const getAllDeliveryCharges = asyncHandler(async (req, res) => {
  // Fetch all delivery charges from the database
  const deliveryCharges = await DeliveryCharge.find();

  return res.status(200).json({
    success: true,
    data: deliveryCharges,
    message: "Delivery charges retrieved successfully",
  });
});

export { createDeliveryCharge, deleteDeliveryCharge, getAllDeliveryCharges };
