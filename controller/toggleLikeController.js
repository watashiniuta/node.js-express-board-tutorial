db = require("../model/dbConnector.js");

exports.toggleLike = async (req, res) => {
    const userID = req.session.userID;
    const { target_type, target_id } = req.params;
    let isLiked;

    if (!userID) {
        return res.json({ isLoggin: false });
    }

    try {
        const [userRows] = await db.promise().query(`SELECT * FROM users WHERE userID = ?`, [userID]);
        const [existingLike] = await db.promise().query(`SELECT * FROM likes LEFT JOIN users ON likes.user_id=users.id WHERE target_type = ? AND target_id = ? AND userID = ?`, [target_type, parseInt(target_id), userID]);

        if (existingLike.length > 0) {
            // If you already like it, cancel it
            await db.promise().query(`DELETE FROM likes WHERE target_type = ? AND target_id = ? AND user_id = ?`, [target_type, parseInt(target_id), userRows[0].id]);
            await db.promise().query(`UPDATE ${target_type} SET like_count = like_count - 1 WHERE id = ?`, [parseInt(target_id)]);
            
            isLiked = false;
        } else {
            // If like isn't pressed, add like
            await db.promise().query(`INSERT INTO likes (target_type, target_id, user_id, created_at) VALUES (?, ?, ?, NOW())`, [target_type, parseInt(target_id), userRows[0].id]);
            await db.promise().query(`UPDATE ${target_type} SET like_count = like_count + 1 WHERE id = ?`, [parseInt(target_id)]);

            isLiked = true;
        }  

        res.json({ isLoggin: true, isLiked: isLiked });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
};