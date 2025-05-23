class ClientConnection {
	constructor(ws, clientIdentifier) {
		this.ws = ws;
		this.clientIdentifier = clientIdentifier;
		this.intervalId = null;

		console.log(`[WSClinet(${this.clientIdentifier})] Connection handler created.`);
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
			`[WSClinet(${this.clientIdentifier})] Started data interval (ID: ${this.intervalId}).`,
		);
	}

	sendMemoryUsage() {
		if (this.ws.readyState !== WebSocket.OPEN) {
			return;
		}

		this.ws.send(JSON.stringify(process.memoryUsage()), (err) => {
			if (err) {
				console.error(
					`[WSClinet(${this.clientIdentifier})] Error sending message:`,
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
			`[WSClinet(${this.clientIdentifier})] Received message: ${message.toString()}`,
		);
	}

	handleClose(code, reason) {
		this.cleanup();
	}

	handleError(error) {
		console.error(`[WSClinet(${this.clientIdentifier})] WebSocket error:`, error);
		this.cleanup();
	}

	cleanup() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			console.log(`[WSClinet(${this.clientIdentifier})] Cleared interval (ID: ${this.intervalId}).`);
			this.intervalId = null;
		}

		console.log(`[WSClinet(${this.clientIdentifier})] Connection resources cleaned up.`);
	}
}

export default ClientConnection;
