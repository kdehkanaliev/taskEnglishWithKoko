import express from "express";
import { workspaceAccess } from "../middlewares/workspace.middleware.js";
import {
  createWorkspace,
  getWorkspace,
  deleteWorkspace,
  acceptInvite,
  inviteUser,
} from "../controllers/workspace.controller.js";
import { authMiddleware } from "../middlewares/jwt.middleware.js";

const router = express.Router();

/**
 * @openapi
 * /workspaces:
 *   post:
 *     summary: Create workspace
 *     tags:
 *       - Workspaces
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Workspace
 *     responses:
 *       201:
 *         description: Workspace created successfully
 */
router.post("/workspaces", authMiddleware, createWorkspace);

/**
 * @openapi
 * /workspaces/accept-invite:
 *   get:
 *     summary: Accept workspace invite
 *     tags:
 *       - Workspaces
 *     responses:
 *       200:
 *         description: Invite accepted successfully
 */
router.get("/workspaces/accept-invite", acceptInvite);

/**
 * @openapi
 * /workspaces/{workspaceId}:
 *   get:
 *     summary: Get workspace by ID
 *     tags:
 *       - Workspaces
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace data
 */
router.get(
  "/workspaces/:workspaceId",
  authMiddleware,
  workspaceAccess(["owner", "admin", "member"]),
  getWorkspace,
);

/**
 * @openapi
 * /workspaces/{workspaceId}:
 *   delete:
 *     summary: Delete workspace
 *     tags:
 *       - Workspaces
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workspace deleted successfully
 */
router.delete(
  "/workspaces/:workspaceId",
  authMiddleware,
  workspaceAccess(["owner"]),
  deleteWorkspace,
);

/**
 * @openapi
 * /workspaces/{workspaceId}/invite:
 *   post:
 *     summary: Invite user to workspace
 *     tags:
 *       - Workspaces
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@gmail.com
 *               role:
 *                 type: string
 *                 example: member
 *     responses:
 *       200:
 *         description: User invited successfully
 */
router.post(
  "/workspaces/:workspaceId/invite",
  authMiddleware,
  workspaceAccess(["owner", "admin"]),
  inviteUser,
);

export default router;
