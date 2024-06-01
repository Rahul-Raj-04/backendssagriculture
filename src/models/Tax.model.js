// Import Mongoose
import mongoose from "mongoose";

// Define a schema
const taxSchema = new mongoose.Schema(
  {
    taxTitle: {
      type: String,
      required: true,
    },
    taxPercentage: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true, // Add timestamps to the schema
  }
);

// Create a model
export const Tax = mongoose.model("Tax", taxSchema);
