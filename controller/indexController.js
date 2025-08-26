exports.getMainPage = (req, res) => {
    const userID = req.session.userID;

    res.render("index.ejs", { userID: userID });
};

exports.getAboutPage = (req, res) => {
    const userID = req.session.userID;

    res.render("intro.ejs", { userID: userID });
};

exports.getLogout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};