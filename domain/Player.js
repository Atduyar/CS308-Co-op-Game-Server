export default class Player {
	id;
	pos;
	coins;

	constructor(client) {
		this.client = client;
		this.pos = { x: 0, y: 0 };
		this.coins = 0;
		this.id = null;
	}

	getName() {
		return this.client.user.name;
	}

	giveLobbyId(id) {
		this.id = id;
	}

	setPos(pos) {
		this.pos.x = pos.x;
		this.pos.y = pos.y;
	}

}
