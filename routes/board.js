const boardController = require("../controller/boardController.js");
const upmentRouter = require("./upment.js");
const express = require("express");
const router = express.Router();

// connecting upemtnRouter
router.use("/:postID/comment/upment", upmentRouter);

router.get("/", boardController.getBoardList);
router.get("/:id", boardController.getBoard);


module.exports = router;