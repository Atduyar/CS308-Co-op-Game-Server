export default class Lobby {
	name;
	maxPlayerCount;
	// Private
	#players;
	#id;

	constructor(lobbyName, id) {
		this.name = lobbyName;
		this.maxPlayerCount = 2;
		this.#players = [];
		this.#id = id;
	}

	get playerCount() {
		return this.#players.length;
	}

	get id() {
		return this.#id;
	}

	get players() {
		return this.#players;
	}

	addPlayer(player) {
		if (this.#players.length >= this.maxPlayerCount) {
			return false;
		}
		this.#players.push(player);
	}
}
