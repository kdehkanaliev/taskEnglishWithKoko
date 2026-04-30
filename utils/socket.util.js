import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Board } from "../schema/board.model.js";
import { Workspace } from "../schema/workspace.model.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) return next(new Error("Unauthorized"));

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.user = decoded;

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.user.id);

    socket.on("join-board", async (boardId) => {
      const userId = socket.user.id;

      const board = await Board.findById(boardId);
      if (!board) return socket.emit("error", "Board not found");

      const workspace = await Workspace.findById(board.workspaceId);

      const member = workspace.members.find(
        (m) => m.userId.toString() === userId,
      );

      if (!member) {
        return socket.emit("error", "Access denied");
      }

      socket.join(boardId);
      socket.emit("joined-board", boardId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    socket.join(userId);
  });
  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
