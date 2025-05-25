class ClientConnection {
	constructor(ws, clientIdentifier, user) {
		this.ws = ws;
		this.user = {
			ip: clientIdentifier,
			...user
		};
		this.intervalId = null;

		console.log(`[WSClinet(${this.user.ip})] Connection handler created.`);
		this.initialize();
	}

	initialize() {
		this.setupDataInterval();
		this.setupEventListeners();

		// You could send an initial welcome message if needed
		// this.sendMessage({ type: "system", message: "Welcome!" });
	}

	setupDataInterval() {
		this.intervalId = setInterval(() => {
			this.sendMemoryUsage();
		}, 1000);
		console.log(
			`[WSClinet(${this.user.ip})] Started data interval (ID: ${this.intervalId}).`,
		);
	}

	sendMemoryUsage() {
		if (this.ws.readyState !== WebSocket.OPEN) {
			return;
		}

		this.ws.send(JSON.stringify(process.memoryUsage()), (err) => {
			if (err) {
				console.error(
					`[WSClinet(${this.user.ip})] Error sending message:`,
					err,
				);
			}
		});
	}

	setupEventListeners() {
		this.ws.on("message", this.handleMessage.bind(this));
		this.ws.on("close", this.handleClose.bind(this));
		this.ws.on("error", this.handleError.bind(this));
	}

	handleMessage(message) {
		console.log(
			`[WSClinet(${this.user.ip})] Received message: ${message.toString()}`,
		);
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
