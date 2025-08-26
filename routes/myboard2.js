const { isAuthenticated } = require("../middleware/auth-middleware.js");
const myboardController = require("../controller/myboardController.js");
const express = require("express");
const router = express.Router();


router.get("/create", isAuthenticated, myboardController.getCreateBoardPage);
router.post("/", isAuthenticated, myboardController.CreateBoard);

router.get("/:id/update", isAuthenticated, myboardController.getBoardUpdatePage);
router.put("/:id", isAuthenticated, myboardController.updateBoard);
router.delete("/:id", isAuthenticated, myboardController.deleteBoard);

router.get("/", isAuthenticated, myboardController.getBoardListPage);
router.get("/:id", isAuthenticated, myboardController.getBoardPage);

module.exports = router;