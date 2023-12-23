const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const documentSchema = new mongoose.Schema(
  {
    identification_number: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: String,
      required: true,
    },
    date_of_issue: {
      type: String,
      required: true,
    },
    date_of_expiry: {
      type: String,
      required: true,
    },
    raw_ocr_data: {
      type: String,
      required: true,
    },
    image_link: {
      type: String,
      required: true,
    },
    success_level: {
      type: String,
      required: true,
    },
    created_by: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    // will automatically give a timestamp of createdAt and updatedAt
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

mongoose.model("Document", documentSchema);
