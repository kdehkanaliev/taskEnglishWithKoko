import express from "express";
import env from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import workspaceRouter from "./routes/workspace.route.js";
import boardRouter from "./routes/board.route.js";
import taskRouter from "./routes/task.route.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.util.js";

env.config();

connectDB();

const app = express();

app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", userRouter);
app.use("/", workspaceRouter);
app.use("/", boardRouter);
app.use("/", taskRouter);

export default app;
