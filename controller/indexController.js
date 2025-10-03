const saveSessionAndRespond = require("../utils/sessionSaveHelper");

exports.getMainPage = (req, res) => {
    const userID = req.session.userID;

    res.render("index.ejs", { userID: userID });
};

exports.getAboutPage = (req, res) => {
    const userID = req.session.userID;

    res.render("intro.ejs", { userID: userID });
};

exports.getLogout = (req, res) => {
    
    /*
        // expire the broswer of session cookie (traditional method)
        res.clearCookie('connect.sid');
        req.session.destroy();

        // delete the user info of session data cause of view function (modern method)
        delete req.session.userID; 
    */

    delete req.session.userID;
    delete req.session.loginFailed;
    delete req.session.emailAuthCode;
    saveSessionAndRespond(req, res, () => { res.redirect(`/`); });
};