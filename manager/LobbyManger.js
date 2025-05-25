import Lobby from "../domain/Lobby.js";

export default class LobbyManager {
	#lobbies = {};
	#nextId = 1;

	constructor() {
		if (!!LobbyManager.instance) {
			return LobbyManager.instance;
		}

		LobbyManager.instance = this;


		return this;
	}

	getLobby(id) {
		const l = this.#lobbies[id]
		if (l == null) {
			return null;
		}
		return {
			id: l.id,
			name: l.name,
			count: `${l.playerCount}/${l.maxPlayerCount}`,
			canJoin: l.playerCount < l.maxPlayerCount
		};
	}

	getLobbies() {
		return Object.values(this.#lobbies).map(l => ({
			id: l.id,
			name: l.name,
			count: `${l.playerCount}/${l.maxPlayerCount}`,
			canJoin: l.playerCount < l.maxPlayerCount
		}));
	}

	createLobby(name) {
		let l = new Lobby(name, this.#nextId);
		this.#lobbies[this.#nextId] = l;
		this.#nextId++;

		return l;
	}

	delete(id) {
		delete this.#lobbies[id];
	}

	deleteAll() {
		this.#lobbies = {};
	}
}
