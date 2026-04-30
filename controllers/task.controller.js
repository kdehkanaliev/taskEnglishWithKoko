import { Task } from "../schema/task.model.js";
import { getIO } from "../utils/socket.util.js";

const createTask = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description } = req.body;

    const lastTask = await Task.findOne({ boardId }).sort({ order: -1 });

    const order = lastTask ? lastTask.order + 1 : 0;

    const task = await Task.create({
      title,
      description,
      boardId,
      order,
    });

    const io = getIO();
    io.to(boardId.toString()).emit("task-created", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error creating task" });
  }
};

const getTasks = async (req, res) => {
  try {
    const { boardId } = req.params;

    const tasks = await Task.find({ boardId }).sort({ order: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

const moveTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { newStatus, newOrder } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo) {
      await emailQueue.add("send-email", {
        email: "user@example.com", // userdan olasan
        taskId: task._id,
      });
    }

    task.status = newStatus;
    task.order = newOrder;

    await task.save();

    // 🔥 REALTIME
    const io = getIO();
    io.to(task.boardId.toString()).emit("task-updated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error moving task" });
  }
};

const reorderTasks = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { tasks } = req.body;

    const bulk = tasks.map((t) => ({
      updateOne: {
        filter: { _id: t.id },
        update: {
          order: t.order,
          status: t.status,
        },
      },
    }));

    await Task.bulkWrite(bulk);

    const updatedTasks = await Task.find({ boardId }).sort({ order: 1 });

    const io = getIO();
    io.to(boardId.toString()).emit("tasks-reordered", updatedTasks);

    res.json({ message: "Reordered" });
  } catch (err) {
    res.status(500).json({ message: "Error reordering tasks" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const io = getIO();
    io.to(task.boardId.toString()).emit("task-deleted", taskId);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting task" });
  }
};

export { createTask, getTasks, moveTask, reorderTasks, deleteTask };
