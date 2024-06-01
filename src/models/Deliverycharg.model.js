import mongoose from "mongoose";

// Define the schema for the deliveryCharge model
const deliveryChargeSchema = new mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  Status: {
    type: String,
    enum: ["active", "inactive"], // Example of possible statuses
    default: "active",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Create the deliveryCharge model using the schema
export const DeliveryCharge = mongoose.model(
  "DeliveryCharge",
  deliveryChargeSchema
);
