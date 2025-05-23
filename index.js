import express from "express";
import { createServer } from "http";
import authRoute from "./routes/auth.js";
import WSServer from "./routes/WSServer.js"

const PORT = 8080;

// ----- EXPRESS JS
const app = express();
app.use(authRoute);

// ----- HTTP SERVER
const server = createServer(app);

// ----- WEBSOCKET SERVER
const serverManager = new WSServer(server);
serverManager.setupEventListeners();

// ----- SERVER START
server.listen(PORT, function() {
	console.log(`[Server] Listening on http://localhost:${PORT}`);
	console.log(`[Server] Listening on ws://localhost:${PORT}`);
});
