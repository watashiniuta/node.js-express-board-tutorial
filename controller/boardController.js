const db = require("../model/dbConnector.js");


exports.getBoardList = async (req, res) => {
    const userID = req.session.userID;
    const search = req.query.search || '';
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        let query, params, countQuery, countParams;

        if (search) {
            query = `SELECT posts.id, title, description, created_at, userID FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE title LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            params = [`%${search}%`, limit, offset];
            countQuery = `SELECT COUNT(*) AS total FROM posts WHERE title LIKE ?`;
            countParams = [`%${search}%`];
        } else {
            query = `SELECT posts.id, title, description, created_at, userID FROM posts LEFT JOIN users ON posts.authorID=users.id ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            params = [limit, offset];
            countQuery = `SELECT COUNT(*) AS total FROM posts`;
            countParams = [];
        }

        const [results] = await db.promise().query(query, params);
        const [countRows] = await db.promise().query(countQuery, countParams);
        const totalPosts = countRows[0].total;
        const totalPages = Math.ceil(totalPosts / limit);

        res.render("./board/boardList.ejs", {
            results: results,
            userID: userID,
            totalPages: totalPages,
            search: search
        });
    } catch (error) {
        console.error("게시글 목록 조회 오류: ", error);
    }
};

exports.getBoard = async (req, res, next) => {
    const id = req.params.id;
    const userID = req.session.userID;

    try {
        // certain post
        const [result] = await db.promise().query(`SELECT posts.id, userID, title, description, created_at FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE posts.id=?`, [id]);
        
        // all of upment data
        const [results2] = await db.promise().query(`SELECT upment.id, upment.description, upment.created_at, upment.updated_at, upment.downment_count, upment.like_count, upment.postID, users.userID FROM upment LEFT JOIN users ON upment.authorID=users.id WHERE postID=? ORDER BY created_at DESC`, [id]);
        const [rows] = await db.promise().query(`SELECT COUNT(*) AS totalUpmentCount FROM upment WHERE postID=?`,[id]);
        const totalUpmentCount = rows[0].totalUpmentCount;

        // all of downment data
        const [results3] = await db.promise().query(`SELECT downment.id, downment.description, downment.created_at, downment.updated_at, downment.like_count, downment.postID, downment.parentID, users.userID FROM downment LEFT JOIN users ON downment.authorID=users.id WHERE downment.postID=? ORDER BY downment.created_at DESC`,[id]);

        if (result.length === 0) {
            return next();
        } else {
            res.render("./board/boardRead.ejs", { 
                result: result[0], 
                userID: userID, 
                results2: results2, 
                totalUpmentCount: totalUpmentCount,
                results3: results3 // adding
            });
        }
    } catch (error) {
        console.error("보드 게시글 조회 오류: ", error);
    }
};