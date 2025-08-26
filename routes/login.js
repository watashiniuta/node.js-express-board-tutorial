const { isNotAuthenticated } = require("../middleware/auth-middleware.js");
const loginController = require("../controller/loginController");
const express = require("express");
const router = express.Router();


router.get("/", isNotAuthenticated, loginController.getLoginPage);
router.post("/", loginController.postLoginInfo);

router.get("/register", isNotAuthenticated, loginController.getRegisterPage);
router.post("/register", loginController.postRegisterInfo);

router.get("/findID", loginController.getFindIDPage);
router.get("/findPassword", loginController.getFindPasswordPage);

router.put("/findPassword", loginController.putPassword);
// check userID duplicated API
router.post("/id_check", loginController.checkIDDuplicated);


module.exports = router;