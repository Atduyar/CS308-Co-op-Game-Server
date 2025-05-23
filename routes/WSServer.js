import { WebSocketServer, WebSocket } from "ws";
import ClientConnection from "./ClientConnection.js";

class WSServer {
	constructor(server) {
		this.wss = new WebSocketServer({ server });
	}

	setupEventListeners() {
		this.wss.on("connection", this.onConnection.bind(this));
		this.wss.on("listening", this.onListening.bind(this));
		this.wss.on("error", this.onError.bind(this));
		console.log("[WSServer] Server event listeners configured.");
	}

	onConnection(ws, req) {
		const clientIp = req.socket.remoteAddress;
		console.log(`[WSServer] Client connected from ${clientIp}`);

		new ClientConnection(ws, clientIp);
	}

	onListening() {
		console.log(`[WSServer] WebSocket server started and listening.`);
	}

	onError(error) {
		console.error("[WSServer] WebSocket server error:", error);
	}
}

export default WSServer;
