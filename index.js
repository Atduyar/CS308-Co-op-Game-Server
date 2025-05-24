import express from "express";
import { createServer } from "http";
import 'dotenv/config'
import WSServer from "./webSocet/WSServer.js"

import authRoute from "./routes/auth.js";
import lobbyRoute from "./routes/lobby.js";

const PORT = 8080;

// ----- EXPRESS JS
const app = express();
app.use(express.json());

app.use(authRoute);
app.use('/lobby', lobbyRoute);

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
