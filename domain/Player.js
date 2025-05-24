export default class Player {
	id;
	pos;
	coins;

	constructor(id){
		this.id = id;
		this.pos = {x: 0, y: 0};
		this.coins = 0;
	}
}
