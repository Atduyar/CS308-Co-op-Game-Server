import express from "express";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("asd from httpRoutes.js");
});


export default router;
