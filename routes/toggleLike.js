toggleLikeController = require("../controller/toggleLikeController.js");
const express = require("express");
const router = express.Router();

// Toggle like API
router.post("/:target_type/:target_id", toggleLikeController.toggleLike);

module.exports = router;