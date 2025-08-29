const db = require("../model/dbConnector.js");


exports.getMyProfilePage = async (req, res) => {
    const userID = req.session.userID;

    try {
        const [results] = await db.promise().query(`SELECT * FROM users WHERE userID=?`, [userID]);

        res.render("./myprofile/myprofileRead.ejs", { userID: userID, results: results[0] });
    } catch (error) {
        console.error("내 프로필 오류: ", error);
    }
};

exports.putMyProfileInfo = async (req, res) => {
    const userID = req.session.userID;
    const email = req.body.email;
    var imageUrl = null;

    try {
        if (req.file) {
            // Create a URL if you have a newly uploaded image
            const fileKey = req.file.key;
            imageUrl = `${process.env.CLOUDFRONT_URL}/${fileKey}`;
        } else {
            // Keep existing images if you do not upload them
            const [user] = await db.promise().query(`SELECT mpimageUrl FROM users WHERE userID=?`, [userID]);
            imageUrl = user[0].mpimageUrl;
        }

        // DB update
        await db.promise().query(
            `UPDATE users SET email=?, mpimageUrl=? WHERE userID=?`,
            [email, imageUrl, userID]
        );

        res.redirect(`/myprofile`);
    } catch (error) {
        console.error("내 프로필 수정 오류: ", error);
    }
};

exports.deleteMyProfileInfo = async (req, res) => {
    const userID = req.session.userID;

    try {
        await db.promise().query(`DELETE FROM users WHERE userID=?`, [userID]);

        res.redirect(`/logout`);
    } catch (error) {
        console.error("유저 정보 삭제 오류: error");
    } 
};