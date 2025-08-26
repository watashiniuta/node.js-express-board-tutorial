// check is logged in middleware
function isAuthenticated(req, res, next) {
  const userID = req.session.userID;

  if (userID) {
    return next(); // Continue processing requests if user logged in
  } else {
    res.redirect(`/login`);
  }
}

// Access Restricted Middleware
function isNotAuthenticated(req, res, next) {
  const userID = req.session.userID;

  if (!userID) {
    return next(); // Continue processing requests if user not logged in
  } else {
    return res.render("index.ejs", { userID: userID }); // Redirect to Main Page if you are already logged in
  }
}

module.exports = { isAuthenticated, isNotAuthenticated };