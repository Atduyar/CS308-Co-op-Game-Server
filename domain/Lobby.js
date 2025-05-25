export default class Lobby {
	name;
	maxPlayerCount;
	// Private
	#nextPlayerId = 1;
	#players;
	#playerCount;
	#id;

	constructor(lobbyName, id) {
		this.name = lobbyName;
		this.maxPlayerCount = 2;
		this.#players = {};
		this.#playerCount = 0;
		this.#id = id;
	}

	get playerCount() {
		return this.#playerCount;
	}

	get id() {
		return this.#id;
	}

	get players() {
		return this.#players;
	}

	kickPlayer(player) {
		if (!this.#players[player.id]) {
			return;
		}
		delete this.#players[player.id];
		this.#playerCount--;
	}

	addPlayer(player) {
		if (this.#playerCount >= this.maxPlayerCount) {
			return false;
		}
		this.#players[this.#nextPlayerId] = player;
		this.#players[this.#nextPlayerId].giveLobbyId(this.#nextPlayerId);
		this.#nextPlayerId++;
		this.#playerCount++;
		return true;
	}

	sendEventToOthers(fPlayer, event) {
		const fId = fPlayer.id;
		for (const [id, player] of Object.entries(this.players)) {
			if (id == fId) continue;
			player.client.sendEvent(event);
		}
	}
}
