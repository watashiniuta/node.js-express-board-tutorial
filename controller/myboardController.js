const db = require("../model/dbConnector.js");
const sanitizeHtml = require("sanitize-html");


exports.getCreateBoardPage = (req, res) => {
    const userID = req.session.userID;

    res.render("./myboard/myboardCreate.ejs", { userID, userID });
};

exports.CreateBoard = async (req, res) => {
    const title = sanitizeHtml(req.body.title);
    const description = sanitizeHtml(req.body.description);
    const userID = req.session.userID;

    try {
        const [results1] = await db.promise().query(`SELECT * FROM users WHERE userID=?`, [userID]);
        const [results2] = await db.promise().query(`INSERT INTO posts (title, description, created_at, authorID) VALUES (?, ?, NOW(), ?)`, [title, description, results1[0].id]);

        res.redirect(`/myboard/${results2.insertId}`);
    } catch (error) {
        console.error("게시글 정보 작성(post) 오류: ", error);
    }
};

exports.getBoardUpdatePage = async (req, res, next) => {
    // 1.Check if you're logged in (401 return)
    const userID = req.session.userID;
    const id = req.params.id;

    //2. Verify that the data entered into url is data that exists. (404 return)
    try {
        const [result] = await db.promise().query(`SELECT posts.id, title, description, created_at, updated_at, userID FROM posts LEFT JOIN users ON authorID=users.id WHERE posts.id=?`, [id]);

        if (!result.length) {
            return next();
        } else {
            //3. Verify access rights (403 return)
            if (result[0].userID === userID) {
                res.render("./myboard/myboardUpdate.ejs", { result: result[0], userID: userID });
            } else {
                res.render("./authority.ejs", { userID: userID, message: "modify" });
            }
        }
    } catch (error) {
        console.error("게시글 수정 화면 정보 오류: ", error);
    }
};

exports.updateBoard = async (req, res) => {
    const title = sanitizeHtml(req.body.title);
    const description = sanitizeHtml(req.body.description);
    const id = req.params.id;

    try {
        await db.promise().query(`UPDATE posts SET title=?, description=?, updated_at=NOW() WHERE id=?`, [title, description, id]);

        res.redirect(`/myboard/${id}`);
    } catch (error) {
        console.error("게시글 정보 수정(put) 오류: ", error);
    }
};

exports.deleteBoard = async (req, res) => {
    const id = req.params.id;
    const userID = req.session.userID;

    try {
        const [result1] = await db.promise().query(`SELECT * FROM posts LEFT JOIN users ON authorID=users.id WHERE posts.id=?`, [id]);

        if (result1[0].userID === userID) {
            await db.promise().query(`DELETE FROM posts WHERE id=?`, [id]);

            res.redirect(`/myboard`);
        } else {
            res.render("./authority.ejs", { userID: userID, message: "delete"});
        }
    } catch (error) {
        console.error("게시글 정보 삭제(delete) 오류: ", error);
    }
};

exports.getBoardListPage = async (req, res) => {
    const userID = req.session.userID;

    try {
        const [results] = await db.promise().query(`SELECT posts.id, userID, title, created_at FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE userID=? ORDER BY created_at DESC`, [userID]);

        res.render("./myboard/myboardList.ejs", { results: results, userID: userID });
    } catch (error) {
        console.error("내 게시글 목록 불러오기 오류: ", error);
    }
};

exports.getBoardPage = async (req, res, next) => {
    const id = req.params.id;
    const userID = req.session.userID;

    try {
        const [result] = await db.promise().query(`SELECT posts.id, title, description, created_at, updated_at, userID FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE posts.id=?`, [id]);

        if (!result.length) {
            return next();
        } else {
            if (result[0].userID === userID) {
                res.render("./myboard/myboardRead.ejs", { result: result[0], userID: userID });
            } else {
                res.render("./authority.ejs", { userID: userID, message: "view"});
            }
        }
    } catch (error) {
        console.error("내 게시글 조회 오류: ", error);
    }
};
