import LobbyManager from "../manager/LobbyManger.js";
import Player from "../domain/Player.js";
import Lobby from "../domain/Lobby.js";

class ClientConnection {
	ws;
	user;

	#lobby = null;
	#player = null;
	#lobbyManager = new LobbyManager();

	constructor(ws, clientIdentifier, user) {
		this.ws = ws;
		this.user = {
			ip: clientIdentifier,
			...user
		};

		console.log(`[WSClinet(${this.user.ip})] Connection handler created.`);
		this.initialize();
	}

	initialize() {
		this.setupEventListeners();
		// this.setupDataInterval();

		// You could send an initial welcome message if needed
		// this.sendMessage({ type: "system", message: "Welcome!" });
	}

	// setupDataInterval() {
	// 	this.intervalId = setInterval(() => {
	// 		this.sendMemoryUsage();
	// 	}, 1000);
	// 	console.log(
	// 		`[WSClinet(${this.user.ip})] Started data interval (ID: ${this.intervalId}).`,
	// 	);
	// }
	//
	// sendMemoryUsage() {
	// 	if (this.ws.readyState !== WebSocket.OPEN) {
	// 		return;
	// 	}
	//
	// 	this.ws.send(JSON.stringify(process.memoryUsage()), (err) => {
	// 		if (err) {
	// 			console.error(
	// 				`[WSClinet(${this.user.ip})] Error sending message:`,
	// 				err,
	// 			);
	// 		}
	// 	});
	// }

	setupEventListeners() {
		this.ws.on("message", this.handleMessage.bind(this));
		this.ws.on("close", this.handleClose.bind(this));
		this.ws.on("error", this.handleError.bind(this));
	}

	handleMessage(message) {
		let data;
		try {
			data = JSON.parse(message);
		}
		catch (error) {
			console.error(
				`[WSClinet(${this.user.ip})] Received non-JSON message: ${message.toString()}`,
			);
			return;
		}

		switch (data.type) {
			case "join":
				const lb = this.#lobbyManager.getLobbyRaw(data.lobbyId);
				if (!lb) {
					console.error(
						`[WSClinet(${this.user.ip})] Lobby do not exist: ${data.lobbyId}`,
					);
					return;
				}
				if (this.#lobby) {
					this.#lobby.kickPlayer(this.#player);
					this.#lobby = null;
					this.#player = null;
				}
				this.#player = new Player(this);
				if (!lb.addPlayer(this.#player)) {
					this.#player = null;
					console.error(
						`[WSClinet(${this.user.ip})] Lobby is full: ${data.lobbyId}`,
					);
					this.sendEvent({
						type: "err",
						detail: "Lobby is full"
					});
					return;
				}
				this.#lobby = lb;
				console.log(`[WSClinet(${this.user.ip})] Player \"${this.user.name}\" joined to the lobby: #${data.lobbyId}`);
				this.sendEvent({
					type: "conf",
					what: "join"
				});
				console.log(this.#lobby.players);
				break;
			case "exit":
				console.log(`[WSClinet(${this.user.ip})] Player \"${this.user.name}\" exit form the lobby: #${data.lobbyId}`);
				this.#lobby.kickPlayer(this.#player);
				this.#player = null;
				this.#lobby = null;
				break;
			case "uPos":
				if (!this.#lobby) {
					console.error(
						`[WSClinet(${this.user.ip})] Cannot send this event before joining a lobby.`,
					);
					this.sendEvent({
						type: "err",
						detail: "No lobby."
					});
					return;
				}
				this.#player.setPos(data.pos);
				this.#lobby.sendEventToOthers(this.#player, {
					type: "event",
					event: "uPos",
					playerId: this.#player.id,
					pos: data.pos,
				})
				break;
			default:
				break;
		}
	}

	sendEvent(e) {
		this.ws.send(JSON.stringify(e));
	}

	handleClose(code, reason) {
		this.cleanup();
	}

	handleError(error) {
		console.error(`[WSClinet(${this.user.ip})] WebSocket error:`, error);
		this.cleanup();
	}

	cleanup() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			console.log(`[WSClinet(${this.user.ip})] Cleared interval (ID: ${this.intervalId}).`);
			this.intervalId = null;
		}

		console.log(`[WSClinet(${this.user.ip})] Connection resources cleaned up.`);
	}
}

export default ClientConnection;
