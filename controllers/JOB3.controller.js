import { exportQueue } from "../queue.js";
import { Task } from "../schema/task.model.js";

export const exportTasks = async (req, res) => {
  const { boardId } = req.params;
  const userId = req.user.id;

  const tasks = await Task.find({ boardId });

  await exportQueue.add("export-csv", {
    tasks,
    userId,
  });

  res.json({ message: "Export started" });
};
