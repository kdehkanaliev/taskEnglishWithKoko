import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    email: String,
    workspaceId: mongoose.Schema.Types.ObjectId,
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    token: String,
    expiresAt: Date,
    status: {
      type: String,
      enum: ["pending", "accepted"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Invite = mongoose.model("Invite", inviteSchema);
