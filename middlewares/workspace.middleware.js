import crypto from "crypto";
import { Invite } from "../schema/invite.model.js";
import { Workspace } from "../schema/workspace.model.js";

const workspaceAccess = (roles = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { workspaceId } = req.params;

      const workspace = await Workspace.findById(workspaceId);

      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const member = workspace.members.find(
        (m) => m.userId.toString() === userId,
      );

      if (!member) {
        return res.status(403).json({ message: "Not a member" });
      }

      if (roles.length && !roles.includes(member.role)) {
        return res.status(403).json({ message: "No permission" });
      }

      req.workspace = workspace;
      req.workspaceRole = member.role;

      next();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  };
};

export { workspaceAccess };
