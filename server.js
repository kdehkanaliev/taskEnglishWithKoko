import app from "./app.js";
import "./cron.js";

import http from "http";
import { initSocket } from "./utils/socket.util.js";

const server = http.createServer(app);
initSocket(server);

let PORT = process.env.PORT || 3100;

server.listen(PORT, () => {
  console.log(`server is running ${PORT}`);
});
