import { Router } from "express";
import { authMiddleware } from "../middlewares/jwt.middleware.js";
import { workspaceAccess } from "../middlewares/workspace.middleware.js";
import { createBoard, getBoards } from "../controllers/board.controller.js";

const router = new Router();

/**
 * @openapi
 * /workspaces/{workspaceId}/boards:
 *   post:
 *     summary: Create board in workspace
 *     tags:
 *       - Boards
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
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Frontend Tasks
 *               description:
 *                 type: string
 *                 example: UI related tasks board
 *     responses:
 *       201:
 *         description: Board created successfully
 */
router.post(
  "/:workspaceId/boards",
  authMiddleware,
  workspaceAccess(["owner", "admin"]),
  createBoard,
);

/**
 * @openapi
 * /workspaces/{workspaceId}/boards:
 *   get:
 *     summary: Get all boards in workspace
 *     tags:
 *       - Boards
 *     parameters:
 *       - in: path
 *         name: workspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of boards
 */
router.get(
  "/:workspaceId/boards",
  authMiddleware,
  workspaceAccess(["owner", "admin", "member"]),
  getBoards,
);

export default router;
