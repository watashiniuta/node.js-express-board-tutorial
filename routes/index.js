const { isAuthenticated } = require("../middleware/auth-middleware.js");
const indexController = require("../controller/indexController.js");
const express = require("express");
const router = express.Router();


router.get("/", indexController.getMainPage);
router.get("/about", indexController.getAboutPage);
router.get("/logout", isAuthenticated, indexController.getLogout);


module.exports = router;
