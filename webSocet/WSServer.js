import { WebSocketServer, WebSocket } from "ws";
import ClientConnection from "./ClientConnection.js";
import auth from "../middleware/auth.js";
import { resolve } from "path";

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
		let kickUserOut = null;
		const res = {
			status: (_httpCode) => {
				kickUserOut = true;
			},
			json: (jsonRes) => {
				kickUserOut = jsonRes;
			}
		};
		const next = () => { };
		auth(req, res, next);
		if (kickUserOut) {
			ws.close(1008, 'Invalid or expired token');
			console.log("[WSServer]: Invalid or expired token.")
			return;
		}

		console.log(`[WSServer] Client connected from ${clientIp} named: ${req.user.name}`);
		new ClientConnection(ws, clientIp, req.user);
	}

	onListening() {
		console.log(`[WSServer] WebSocket server started and listening.`);
	}

	onError(error) {
		console.error("[WSServer] WebSocket server error:", error);
	}
}

export default WSServer;
