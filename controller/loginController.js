const regenerateSession = require("../utils/regenerateSessionHelper.js");
const saveSessionAndRespond = require("../utils/sessionSaveHelper.js");
const db = require("../model/dbConnector.js");
const bcrypt = require("bcrypt");
require('dotenv').config();


exports.getLoginPage = (req, res) => {
    const { userID, loginFailed } = req.session;

    res.render("./login/login.ejs", { userID: userID, loginFailed: loginFailed });
};

exports.postLoginInfo = async (req, res) => {
    const { userID, password, isKeepLogin } = req.body;

    try {
        const [results] = await db.promise().query(`SELECT * FROM users WHERE userID=?`, [userID]);

        if (results.length) {
            const match = await bcrypt.compare(password, results[0].password);
            if (userID === results[0].userID && match) {
                const oldData = {
                    viewedPosts: req.session.viewedPosts || {}
                };

                await regenerateSession(req); // Issue a new session ID
                if (isKeepLogin) req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // Extension of session cookie duration when checking login maintenance (e.g. 7 days)

                req.session.userID = userID;
                req.session.loginFailed = false;

                 // Reinsert backup data into a new session
                req.session.viewedPosts = oldData.viewedPosts;
                return saveSessionAndRespond(req, res, () => { res.redirect(`/`); });
            } 
        }

        req.session.loginFailed = true;
        return saveSessionAndRespond(req, res, () => { res.redirect(`/login`); });
    } catch (error) {
        console.error("로그인 오류: ", error);
    }
};

exports.getRegisterPage = (req, res) => {
    const userID = req.session.userID;

    res.render("./login/register.ejs", { userID: userID });
};

exports.postRegisterInfo = async (req, res) => {
    const { userID, password, email } = req.body;

    try {
        const [results] = await db.promise().query(`SELECT * FROM users WHERE email=?`, [email]);

        // check the email exist
        if (results.length > 0) {
            res.redirect(`/login/register`);
        } else {
            const hashPassword = await bcrypt.hash(password, 10);
            await db.promise().query(`INSERT INTO users (userID, password, email) VALUES (?, ?, ?)`, [userID, hashPassword, email]);

            res.redirect(`/login`);
        }
    } catch (error) {
        console.error("회원가입 오류: ", error);
    }
};

exports.getFindIDPage = (req, res) => {
    const userID = req.session.userID;

    res.render("./login/findID.ejs", { userID: userID });
};

exports.getFindPasswordPage = (req, res) => {
    const userID = req.session.userID;

    res.render("./login/findPassword.ejs", { userID: userID });
};

exports.putPassword = async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        await db.promise().query(`UPDATE users SET password=? WHERE email=?`, [hashPassword, email]);

        res.redirect(`/`);
    } catch (erorr) {
        console.error("새 비밀번호 수정 실패: ", error);
    }
};

exports.checkIDDuplicated = async (req, res) => {
    const userID = req.body.userID;

    try {
        const [results] = await db.promise().query(`SELECT * FROM users WHERE userID=?`, [userID]);

        if (results.length > 0) {
            res.json({ exists: true });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        console.error("아이디 중복 체크 오류: ", error);
    }
};