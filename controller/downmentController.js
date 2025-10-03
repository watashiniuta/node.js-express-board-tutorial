const db = require("../model/dbConnector.js");
const sanitizeHtml = require("sanitize-html");


exports.getDownmentUpdatePage = async (req, res, next) => {
    // 1.Check if you're logged in (401 return)
    const { postID, upmentID, downmentID } = req.params;
    const userID = req.session.userID;

    //2. Verify that the data entered into url is data that exists. (404 return)
    try {
        const [result] = await db.promise().query(`SELECT downment.id, description, created_at, updated_at, like_count, postID, parentID, userID FROM downment LEFT JOIN users ON authorID=users.id WHERE postID=? AND parentID=? AND downment.id=?`, [postID, upmentID, downmentID]);

        if (!result.length) {
            next();
        } else {
            //3. Verify access rights (403 return)
            if (result[0].userID === userID) {
                res.render("./comment/downment/downmentUpdate.ejs", { userID: userID, result: result[0] });
            } else {
                res.render("./authority.ejs", { userID: userID, message: "modify" });
            }
        }
    } catch (error) {
        console.error("대댓글 정보 수정 화면 불러오기 오류: ", error);
    }  
};

exports.createDownment = async (req, res) => {
    const { postID, upmentID } = req.params;
    const description = sanitizeHtml(req.body.description);
    const userID = req.session.userID;
    
    // save data on downmentDB
    try {
        const [result] = await db.promise().query(`SELECT * FROM users WHERE userID=?`, [userID]);
        const authorID = result[0].id;
        await db.promise().query(`INSERT INTO downment (description, created_at, postID, parentID, authorID) VALUES (?, NOW(), ?, ?, ?)`, [description, postID, upmentID, authorID]);;

        // reloading the post
        res.redirect(`/board/${postID}`);
    } catch (error) {
        console.error("대댓글 정보 전송 오류: ", error);
    }
};

exports.updateDownment = async (req, res) => {
    const { postID, upmentID, downmentID } = req.params;
    const description = sanitizeHtml(req.body.description);

    try {
        await db.promise().query(`UPDATE downment SET description=?, updated_at=NOW() WHERE id=? AND parentID=?`, [description, downmentID, upmentID]);

        res.redirect(`/board/${postID}`);
    } catch (error) {
        console.error("대댓글 정보 수정 오류: ", error);
    }
};

exports.deleteDownment = async (req, res, next) => {
    const { postID, upmentID, downmentID } = req.params;
    const userID = req.session.userID;

    try {
        const [result] = await db.promise().query(`SELECT downment.id, description, created_at, updated_at, like_count, postID, parentID, userID FROM downment LEFT JOIN users ON authorID=users.id WHERE postID=? AND parentID=? AND downment.id=?`, [postID, upmentID, downmentID]);
        
        if (!result.length) {
            next();
        } else {
            if (result[0].userID === userID) {  
                await db.promise().query(`DELETE FROM downment WHERE id=?`, [downmentID]);

                res.redirect(`/board/${postID}`);
            } else {
                res.render("./authority.ejs", { userID: userID, message: "delete" });
            }
        }
    } catch (error ) {
        console.error("대댓글 정보 삭제 오류: ", error);
    }
};