import cron from "node-cron";
import { Task } from "./schema/task.model.js";

cron.schedule("*/30 * * * *", async () => {
  console.log("Running cron...");

  const tasks = await Task.find({
    dueDate: { $lt: new Date() },
    status: { $ne: "done" },
  });

  for (let task of tasks) {
    task.status = "overdue";
    await task.save();

    console.log(" Task overdue:", task._id);
  }
});
