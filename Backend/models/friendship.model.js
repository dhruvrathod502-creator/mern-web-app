import mongoose from "mongoose";

const friendshipSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    type: {
      type: String,
      enum: ["friend", "follow"],
      default: "friend",
    },
  },
  {
    timestamps: true,
  }
);

friendshipSchema.index(
  { sender: 1, receiver: 1, type: 1 },
  { unique: true }
);

const Friendship = mongoose.model("Friendship", friendshipSchema);

export default Friendship;