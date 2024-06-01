import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  image: {
    type: String,
    require: true,
  },
  title: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

export const Banner = mongoose.model("Banner", bannerSchema);
