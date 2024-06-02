import { asyncHandler } from "../utils/asyncHandler.js";
import { Cart } from "../models/Cart.model.js";
import { Product } from "../models/Product.models.js"; // Import the Product model

import { User } from "../models/User.model.js"; // Import the User model
import { ApiError } from "../utils/ApiError.js";

// Controller to add a product to the cart
const addToCart = asyncHandler(async (req, res) => {
  // Ensure user is logged in

  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    throw new ApiError(400, "Product ID and quantity are required");
  }

  // Check if the product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Find the user's cart
  let cart = await Cart.findOne({ user: req.user._id });

  // If the user doesn't have a cart, create a new one
  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
      total: 0,
      status: "active",
    });
  }

  // Check if the product is already in the cart
  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex !== -1) {
    // If the product is already in the cart, update the quantity
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    // If the product is not in the cart, add it as a new item
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  // Calculate the total price of the cart
  cart.total = cart.items.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  // Save the cart
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product added to cart successfully",
    cart,
  });
});

export { addToCart };
