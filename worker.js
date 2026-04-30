import { Worker } from "bullmq";
import fs from "fs";
import { Parser } from "json2csv";
import { getIO } from "./socket.js";

const connection = {
  host: "127.0.0.1",
  port: 6379,
};

new Worker(
  "emailQueue",
  async (job) => {
    console.log(" Send email to:", job.data.email);
  },
  { connection },
);

new Worker(
  "exportQueue",
  async (job) => {
    const { tasks, userId } = job.data;

    const parser = new Parser();
    const csv = parser.parse(tasks);

    const fileName = `tasks-${Date.now()}.csv`;
    fs.writeFileSync(`./exports/${fileName}`, csv);

    const io = getIO();

    io.to(userId).emit("export-ready", {
      url: `http://localhost:3000/exports/${fileName}`,
    });
  },
  { connection },
);
