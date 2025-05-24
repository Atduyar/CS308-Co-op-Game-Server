import express from "express";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/checkKey", auth, (req, res) => {
	res.json({
		ok: 42
	});
});

export default router;
