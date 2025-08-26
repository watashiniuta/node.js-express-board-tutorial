const downmentController = require("../controller/downmentController.js");
const { isAuthenticated } = require("../middleware/auth-middleware.js");
const express = require("express");
const router = express.Router({ mergeParams: true });


router.get("/:downmentID/update", isAuthenticated, downmentController.getDownmentUpdatePage);
router.post("/", isAuthenticated, downmentController.createDownment);
router.put("/:downmentID", isAuthenticated, downmentController.updateDownment);
router.delete("/:downmentID", isAuthenticated, downmentController.deleteDownment);


module.exports = router;