const { isAuthenticated } = require("../middleware/auth-middleware.js");
const sanitizeHtml = require("sanitize-html");
const express = require("express");
const db = require("../model/dbConnector.js");
const router = express.Router();


router.get("/create", isAuthenticated, function (req, res) {
    const userID = req.session.userID;

    res.render("./myboard/myboardCreate.ejs", { userID, userID });
});

router.post("/create_process", isAuthenticated, function (req, res) {
    const title = sanitizeHtml(req.body.title);
    const description = sanitizeHtml(req.body.description);
    const userID = req.session.userID;

    db.query(`SELECT * FROM users WHERE userID=?`, [userID], function (error1, results1, fields1) {
        if (error1) {
            throw error1;
        }

        db.query(`INSERT INTO posts (title, description, created_at, authorID) VALUES (?, ?, NOW(), ?)`, [title, description, results1[0].id], function (error2, results2, fields2) {
            if (error2) {
                throw error2;
            }

            res.redirect(`/myboard/${results2.insertId}`);
        });
    });
});

router.get("/update/:id", isAuthenticated, function (req, res, next) {
    const userID = req.session.userID;
    const id = req.params.id;

    db.query(`SELECT * FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE posts.id=?`, [id], function (error1, result1, fields1) {
        if (error1) {
            throw error1;
        }

        if (result1.length === 0) {
            return next();
        } else {
            if (result1[0].userID === userID) {
                db.query(`SELECT posts.id, title, description, created_at FROM posts WHERE id=?`, [id], function (error2, result2, fields2) {
                    if (error2) {
                        throw error2;
                    }

                    res.render("./myboard/myboardUpdate.ejs", { result: result2[0], userID: userID });
                });
            } else {
                res.render("./authority.ejs", { userID: userID, message: "update" });
            }
        }
    });
});

router.post("/update_process", isAuthenticated, function (req, res) {
    const title = sanitizeHtml(req.body.title);
    const description = sanitizeHtml(req.body.description);
    const id = req.body.id;
    const userID = req.session.userID;

    db.query(`SELECT posts.id FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE userID=?`, [userID], function (error1, results1, fields1) {
        if (error1) {
            throw error1;
        }

        db.query(`UPDATE posts SET title=?, description=?, updated_at=NOW() WHERE id=?`, [title, description, id], function (error2, results2, fields2) {
        if (error2) {
            throw error2;
        }

        res.redirect(`/myboard/${id}`);
        });
    });
});

router.post("/delete_process", isAuthenticated, function (req, res) {
    const id = req.body.id;
    const userID = req.session.userID;

    db.query(`SELECT * FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE posts.id=?`, [id], function (error1, result1, fields1) {
        if (error1) {
            throw error1;
        }

        if (result1[0].userID === userID) {
            db.query(`DELETE FROM posts WHERE id=?`, [id], function (error2, results2, fields2) {
                if (error2) {
                    throw error2;
                }

                res.redirect(`/myboard`);
            });
        } else {
            res.render("./authority.ejs", { userID: userID, message: "delete"});
        }
    });
});

router.get("/", isAuthenticated, function (req, res) {
    const userID = req.session.userID;

    db.query(`SELECT posts.id, userID, title, created_at FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE userID=? ORDER BY created_at DESC`, [userID], function (error, results, fields) {
        if (error) {
            throw error;
        }

        return res.render("./myboard/myboardList.ejs", { results: results, userID: userID });
    });
});

router.get("/:id", isAuthenticated, function (req, res, next) {
    const id = req.params.id;
    const userID = req.session.userID;

    db.query(`SELECT posts.id, userID, title, description, created_at FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE userID=? AND posts.id=?`, [userID, id], function (error, result, fields) {
        if (error) {
            throw error;
        }

        if (result.length === 0) {
            return next();
        } else {
            return res.render("./myboard/myboardRead.ejs", { result: result[0], userID: userID });
        }
    });
});

module.exports = router;
