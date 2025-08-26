const db = require("../model/dbConnector.js");

exports.getUpmentUpdatePage = async (req, res, next) => {
    // 1.Check if you're logged in (401 return)
    const userID = req.session.userID;
    const { postID, upmentID } = req.params;
    
    //2. Verify that the data entered into url is data that exists. (404 return)
    try {
        const [result] = await db.promise().query(`SELECT upment.id, description, created_at, updated_at, downment_count, like_count, postID, userID FROM upment LEFT JOIN users ON authorID=users.id WHERE postID=? AND upment.id=?`, [postID, upmentID]);
        
        if (!result.length) {
            return next();
        } else {
            //3. Verify access rights (403 return)
            if (result[0].userID === userID) {
                res.render("./comment/upment/upmentUpdate.ejs", { userID: userID, result: result[0] });
            } else {
                res.render("./authority.ejs", { userID: userID, message: "modify" });
            }
        }
    } catch (error) {
        console.error("댓글 수정 정보 불러오기 오류: ", error);
    }
};

exports.createUpment = async (req, res) => {
        const description = req.body.description;
    const postID = req.params.postID;
    const userID = req.session.userID;

    try {  
        // save data on upmentDB
        const [result] = await db.promise().query(`SELECT * FROM users WHERE userID=?`, [userID]);
        const authorID = result[0].id;
        await db.promise().query(`INSERT INTO upment (description, created_at, postID, authorID) VALUES (?, NOW(), ?, ?)`, [description, postID, authorID]);

        // reloading the post
        res.redirect(`/board/${postID}`);
    } catch (error) {
        console.error("댓글 정보 전송 오류: ", error);
    }
};

exports.updateUpment = async (req, res) => {
    const description = req.body.description;
    const { postID, upmentID } = req.params;

    try {
        await db.promise().query(`UPDATE upment SET description=?, updated_at=NOW() WHERE id=?`, [description, upmentID]);

        res.redirect(`/board/${postID}`);
    } catch(error) {
        console.error("댓글 정보 수정 오류: ", error);
    }
};

exports.deleteUpment = async (req, res, next) => {
    const { postID, upmentID } = req.params;
    const userID = req.session.userID;

    try {
        const [result] = await db.promise().query(`SELECT upment.id, description, created_at, updated_at, downment_count, like_count, postID, userID FROM upment LEFT JOIN users ON authorID=users.id WHERE postID=? AND upment.id=?`, [postID, upmentID]);

        if (!result.length) {
            return next();
        } else {
            if (result[0].userID === userID) {
                await db.promise().query(`DELETE FROM upment WHERE id=?`, [upmentID]);

                res.redirect(`/board/${postID}`);
            } else {
                res.render("./authority.ejs", { userID: userID, message: "delete" });
            }
        }
    } catch (error) {
        console.error("댓글 수정 정보 불러오기 오류: ", error);
    }
};