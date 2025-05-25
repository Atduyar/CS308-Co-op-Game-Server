import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]

	if (token == null) {
		return res.json({
			type: "https://example.com/probs/authentication-required",
			title: "Unauthorized",
			status: 401,
			detail: `Access to the requested resource is denied due to invalid or missing authentication credentials.`,
			instance: req.originalUrl,
		});
	}
	jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
		if (err) {
			process.env.TOKEN_SECRET
			console.log("[Server(AUTH)]: Invalid Key.")
			res.status(403);
			return res.json({
				type: "https://example.com/probs/forbidden-access",
				title: "Forbidden",
				status: 403,
				detail: `Key is invalid.`,
				instance: req.originalUrl,
			});
		}

		req.user = user
		next()
	})
}
