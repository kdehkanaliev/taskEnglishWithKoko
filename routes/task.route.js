import { Router } from "express";
import {
  createTask,
  getTasks,
  moveTask,
  reorderTasks,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/jwt.middleware.js";

const router = new Router();

/**
 * @openapi
 * /boards/{boardId}/tasks:
 *   post:
 *     summary: Create task in board
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: boardId
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
 *                 example: Fix login bug
 *               description:
 *                 type: string
 *                 example: JWT login errorni tuzatish kerak
 *               status:
 *                 type: string
 *                 example: todo
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post("/boards/:boardId/tasks", authMiddleware, createTask);

/**
 * @openapi
 * /boards/{boardId}/tasks:
 *   get:
 *     summary: Get all tasks in board
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/boards/:boardId/tasks", authMiddleware, getTasks);

/**
 * @openapi
 * /tasks/{taskId}:
 *   patch:
 *     summary: Move task (change status/column)
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: in-progress
 *     responses:
 *       200:
 *         description: Task moved successfully
 */
router.patch("/tasks/:taskId", authMiddleware, moveTask);

/**
 * @openapi
 * /tasks/reorder/{boardId}:
 *   patch:
 *     summary: Reorder tasks inside board (drag & drop)
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tasks:
 *                 type: array
 *                 example: ["taskId1", "taskId2", "taskId3"]
 *     responses:
 *       200:
 *         description: Tasks reordered successfully
 */
router.patch("/tasks/reorder/:boardId", authMiddleware, reorderTasks);

export default router;
