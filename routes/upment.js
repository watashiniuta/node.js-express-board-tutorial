const { isAuthenticated } = require("../middleware/auth-middleware.js");
const upmentController = require("../controller/upmentController.js");
const downmentRouter = require("./downment.js");
const express = require("express");
const router = express.Router({ mergeParams: true });

// downment router connecting
router.use("/:upmentID/downment", downmentRouter);

router.get("/:upmentID/update", isAuthenticated, upmentController.getUpmentUpdatePage);
router.post("/", isAuthenticated, upmentController.createUpment);
router.put("/:upmentID", isAuthenticated, upmentController.updateUpment);
router.delete("/:upmentID", isAuthenticated, upmentController.deleteUpment);


module.exports = router;
