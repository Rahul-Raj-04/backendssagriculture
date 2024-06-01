import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
      productTitle: {
            type: String,
            required: true
      },
      image: {
            type: String,
            required: true
      },
      thumbnail: {
            type: String,
            required: true
      },
      description: {
            type: String,
            required: true
      },
      oneTimePrice: {
            type: Number,
            required: true
      },
      subscriptionPrice: {
            type: Number,
            required: true
      },
      discountPercentage: {
            type: Number,
            default: 0
      },
      rating: {
            type: Number,
            default: 0
      },
      stock: {
            type: Number,
            default: 0
      },
      category: {
            type: String,
            ref: 'Category',
            required: true
      },
      status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
      },
      visibility: {
            type: String,
            enum: ['public', 'Hidden'],
            default: 'public'
      },
      productTags: {
            type: [String],
            default: []
      },
      productShortDescription: {
            type: String
      }
},
);

// Create a model using the schema
export const Product = mongoose.model('Product', productSchema);


