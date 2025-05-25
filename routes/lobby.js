import express from "express";
import auth from "../middleware/auth.js";
import LobbyManager from "../manager/LobbyManger.js";

const router = express.Router();
const lobbyManager = new LobbyManager();

router.get("/:id", auth, (req, res) => {
	let lb = lobbyManager.getLobby(req.params.id);
	if (lb == null) {
		res.status(404);
		return res.json({
			type: "https://example.com/probs/not-found",
			title: "Lobby Not Found",
			status: 404,
			detail: `Lobby ${req.params.id} is not exist.`,
			instance: req.originalUrl,
		});
	}
	res.json(lb);
});

router.get("/", auth, (_, res) => {
	let lb = lobbyManager.getLobbies();
	res.json(lb);
});


router.post("/:macCount", auth, (req, res) => {
	let lb = lobbyManager.createLobby(req.body.name, req.params.macCount);
	res.json(lb);
});

router.post("/", auth, (req, res) => {
	let lb = lobbyManager.createLobby(req.body.name, 2);
	res.json(lb);
});

router.delete("/:id", auth, (req, res) => {
	lobbyManager.delete(req.params.id);
	res.json({ ok: 42 });
});


router.delete("/", auth, (req, res) => {
	lobbyManager.deleteAll();
	res.json({ ok: 42 });
});

export default router;
