import { WebSocket } from "ws"; // For WebSocket.OPEN constant

class ClientConnection {
  constructor(ws, clientIdentifier) {
    this.ws = ws;
    this.clientIdentifier = clientIdentifier; // e.g., IP address
    this.intervalId = null;

    console.log(`[${this.clientIdentifier}] Connection handler created.`);
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
    }, 100);
    console.log(
      `[${this.clientIdentifier}] Started data interval (ID: ${this.intervalId}).`,
    );
  }

  sendMemoryUsage() {
    if (this.ws.readyState === WebSocket.OPEN) {
      const memoryUsage = process.memoryUsage();
      this.sendMessage(memoryUsage);
    }
  }

  sendMessage(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data), (err) => {
        if (err) {
          console.error(
            `[${this.clientIdentifier}] Error sending message:`,
            err,
          );
          // Optionally, you might want to trigger cleanup or close if send fails
        }
      });
    }
  }

  setupEventListeners() {
    this.ws.on("message", (message) => {
      this.handleMessage(message);
    });

    this.ws.on("close", (code, reason) => {
      this.handleClose(code, reason);
    });

    this.ws.on("error", (error) => {
      this.handleError(error);
    });
  }

  handleMessage(message) {
    console.log(
      `[${this.clientIdentifier}] Received message: ${message.toString()}`,
    );
    // TODO: Add logic to process incoming messages from this client
    // For example, you could parse the message and respond:
    // try {
    //   const parsedMessage = JSON.parse(message.toString());
    //   // process parsedMessage
    // } catch (e) {
    //   this.sendMessage({ error: "Invalid JSON message" });
    // }
  }

  handleClose(code, reason) {
    const reasonString = reason ? reason.toString() : "No reason provided";
    console.log(
      `[${this.clientIdentifier}] Connection closed. Code: ${code}, Reason: ${reasonString}. Stopping interval.`,
    );
    this.cleanup();
  }

  handleError(error) {
    console.error(`[${this.clientIdentifier}] WebSocket error:`, error);
    this.cleanup(); // Important to cleanup on error as 'close' might not always fire
  }

  cleanup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log(
        `[${this.clientIdentifier}] Cleared interval (ID: ${this.intervalId}).`,
      );
      this.intervalId = null;
    }
    // Any other cleanup tasks for this specific client connection
    console.log(`[${this.clientIdentifier}] Connection resources cleaned up.`);
  }
}

export default ClientConnection;
wss.on('connection', function(ws) {
	const id = setInterval(function() {
		ws.send(JSON.stringify(process.memoryUsage()), function() {
		});
	}, 100);
	console.log('started client interval');

	ws.on('close', function() {
		console.log('stopping client interval');
		clearInterval(id);
	});
});

