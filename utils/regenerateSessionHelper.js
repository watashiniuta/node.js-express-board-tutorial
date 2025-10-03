// Util: Wrapping session regenerate to Promise
function regenerateSession(req) {
    return new Promise((resolve, reject) => {
        req.session.regenerate(err => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = regenerateSession;