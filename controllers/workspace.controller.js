import { Invite } from "../schema/invite.model.js";
import { Workspace } from "../schema/workspace.model.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendemail.util.js";

let createWorkspace = async (req, res) => {
  const userId = req.user.id;

  const workspace = await Workspace.create({
    name: req.body.name,
    ownerId: userId,
    members: [
      {
        userId,
        role: "owner",
      },
    ],
  });

  res.json(workspace);
};

async function inviteUser(req, res) {
  const { email, role } = req.body;
  const { workspaceId } = req.params;

  const token = crypto.randomBytes(32).toString("hex");

  const invite = await Invite.create({
    email,
    workspaceId,
    role,
    token,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
  });

  const link = `http://localhost:${process.env.PORT}/workspaces/accept-invite?token=${token}`;

  await sendEmail(email, link);

  res.json({ message: "Invite sent" });
}

let acceptInvite = async (req, res) => {
  try {
    const { token } = req.query;
    const userId = req.user.id;
    const userEmail = req.user.email;
    console.log(token);

    const invite = await Invite.findOne({ token });
    console.log(invite);

    if (!invite) {
      return res.status(400).json({ message: "Invalid invite" });
    }

    if (invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite expired" });
    }

    if (invite.status === "accepted") {
      return res.status(400).json({ message: "Already used" });
    }

    // 🔐 email check
    if (invite.email !== userEmail) {
      return res.status(403).json({ message: "This invite is not for you" });
    }

    const workspace = await Workspace.findById(invite.workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const exists = workspace.members.find(
      (m) => m.userId.toString() === userId,
    );

    if (exists) {
      return res.status(400).json({ message: "Already member" });
    }

    workspace.members.push({
      userId,
      role: invite.role,
    });

    await workspace.save();

    invite.status = "accepted";
    await invite.save();

    res.json({ message: "Joined workspace" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error accepting invite" });
  }
};

let deleteWorkspace = async (req, res) => {
  let id = req.params.id;
  let result = await Workspace.findOneAndDelete({ id });
  res.json({ message: "Workspace deleted", result });
};

let getWorkspace = async (req, res) => {
  let id = req.params.id;
  let result = await Workspace.findOne({ id });
  res.json({ result });
};

export {
  createWorkspace,
  inviteUser,
  acceptInvite,
  deleteWorkspace,
  getWorkspace,
};
