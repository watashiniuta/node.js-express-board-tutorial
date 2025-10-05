const { sendAuthCode, verifyAuthCode } = require("../utils/emailAuth.js");
const saveSessionAndRespond = require("../utils/sessionSaveHelper.js");
const db = require("../model/dbConnector.js");


exports.sendVerificationCode = async (req, res) => {
    const { email, purpose } = req.body;

    try {
        const [results] = await db.promise().query(`SELECT * FROM users WHERE email=?`, [email]);

        if (purpose === "register") {
            if (results.length === 0) {
                await sendAuthCode(req, email, "회원가입 인증코드입니다.", purpose);
                saveSessionAndRespond(req, res, () => { res.json({ success: true, isEmailExists: false }); });
            } else {
                res.json({ success: false, isEmailExists: true });
            }
        } else if (purpose === "findID") {
            if (results.length === 0) {
                res.json({ success: false, isEmailExists: false });
            } else {
                await sendAuthCode(req, email, "기존 아이디 발급 절차를 위한 인증코드입니다.", purpose);
                saveSessionAndRespond(req, res, () => { res.json({ success: true, isEmailExists: true }); });
            }
        } else if (purpose === "findPassword") {
            if (results.length === 0) {
                res.json({ success: false, isEmailExists: false });
            } else {
                await sendAuthCode(req, email, "비밀번호 변경 절차를 위한 인증코드입니다.", purpose);
                saveSessionAndRespond(req, res, () => { res.json({ success: true, isEmailExists: true }); });
            }
        }
    } catch (error) {
        console.error("인증코드 전송 오류: ", error);
        res.json({ success: false });
    }
};

exports.VerificationCode = async (req, res) => {
    const { email, authCode, purpose } = req.body;
    const isMatch = verifyAuthCode(req, authCode, purpose);
    let userID = "해당 데이터가 없습니다.";

    try {
        if (purpose === "findID") {
            const [results] = await db.promise().query(`SELECT * FROM users WHERE email=?`, [email]);
            userID = results[0].userID;

            if (isMatch) {
                saveSessionAndRespond(req, res, () => { res.json({ success: true, userID: userID }); });
            } else {
                res.json({ success: false, userID: userID });
            }
        } else {
            if (isMatch) {
                saveSessionAndRespond(req, res, () => { res.json({ success: true }); });
            } else {
                res.json({ success: false });
            }
        }
    } catch (error) {
        console.error("인증코드 오류: ", error);
        res.json({ success: false });
    }
};