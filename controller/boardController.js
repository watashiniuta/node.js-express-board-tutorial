const saveSessionAndRespond = require("../utils/sessionSaveHelper.js");
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
            query = `SELECT posts.id, title, description, created_at, userID, views FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE title LIKE ? ORDER BY created_at DESC LIMIT ? OFFSET ?`;
            params = [`%${search}%`, limit, offset];
            countQuery = `SELECT COUNT(*) AS total FROM posts WHERE title LIKE ?`;
            countParams = [`%${search}%`];
        } else {
            query = `SELECT posts.id, title, description, created_at, userID, views FROM posts LEFT JOIN users ON posts.authorID=users.id ORDER BY created_at DESC LIMIT ? OFFSET ?`;
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
        const [result] = await db.promise().query(`SELECT posts.id, userID, title, description, created_at, like_count, views FROM posts LEFT JOIN users ON posts.authorID=users.id WHERE posts.id=?`, [id]);
        if (result.length === 0) return next(); // This condition result.length==0 is modified so that it is directly below the query statement.

        // Initialize if the session does not have viewedPosts
        if (!req.session.viewedPosts) req.session.viewedPosts = {};
        const now = Date.now();
        const VIEW_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 7days in milliseconds
        
        // Increase views if the session does not have that post or has expired
        if (!req.session.viewedPosts[id] || (now - req.session.viewedPosts[id]) > VIEW_EXPIRATION) {
            await db.promise().query(`UPDATE posts SET views = views + 1 WHERE id = ?`, [id]);
            req.session.viewedPosts[id] = now; // Update to current time
        }

        // all of upment data
        const [results2] = await db.promise().query(`SELECT upment.id, upment.description, upment.created_at, upment.updated_at, upment.downment_count, upment.like_count, upment.postID, users.userID FROM upment LEFT JOIN users ON upment.authorID=users.id WHERE postID=? ORDER BY created_at DESC`, [id]);
        const [rows] = await db.promise().query(`SELECT COUNT(*) AS totalUpmentCount FROM upment WHERE postID=?`,[id]);
        const totalUpmentCount = rows[0].totalUpmentCount;

        // all of downment data
        const [results3] = await db.promise().query(`SELECT downment.id, downment.description, downment.created_at, downment.updated_at, downment.like_count, downment.postID, downment.parentID, users.userID FROM downment LEFT JOIN users ON downment.authorID=users.id WHERE downment.postID=? ORDER BY downment.created_at DESC`,[id]);

        /*
        // all of like data state - optimized version
        let postLikeState;
        let upmentLikeState = {};
        let downmentLikeState = {};
        if (userID) {
            const [likeRows] = await db.promise().query(`SELECT * FROM likes LEFT JOIN users ON likes.user_id=users.id WHERE userID = ? AND ((target_type = "post" AND target_id = ?) OR (target_type = "upment" AND target_id IN (SELECT id FROM upment WHERE postID=?)) OR (target_type = "downment" AND target_id IN (SELECT id FROM downment WHERE postID=?)))`, [userID, id, id, id]);

            likeRows.forEach(like => {
                if (like.target_type === 'post') {
                    postLikeState = true;
                } else if (like.target_type === 'upment') {
                    upmentLikeState[like.target_id] = true;
                } else if (like.target_type === 'downment') {
                    downmentLikeState[like.target_id] = true;
                }
            });
        }  
        // res.render adding
        postLikeState: postLikeState,
        upmentLikeState: upmentLikeState,
        downmentLikeState: downmentLikeState
        */ 
        
        saveSessionAndRespond(req, res, () => {
            res.render("./board/boardRead.ejs", { 
                result: result[0], 
                userID: userID, 
                results2: results2, 
                totalUpmentCount: totalUpmentCount,
                results3: results3
            });
        });
    } catch (error) {
        console.error("보드 게시글 조회 오류: ", error);
    }
};