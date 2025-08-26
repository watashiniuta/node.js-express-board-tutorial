const myprofileController = require("../controller/myprofileController.js");
const { isAuthenticated } = require("../middleware/auth-middleware.js");
const upload = require("../middleware/upload.js");
const express = require("express");
const router = express.Router();


router.get("/", isAuthenticated, myprofileController.getMyProfilePage);
router.put("/", isAuthenticated, upload.single("profileImage"), myprofileController.putMyProfileInfo);
router.delete("/", isAuthenticated, myprofileController.deleteMyProfileInfo);

module.exports = router;
