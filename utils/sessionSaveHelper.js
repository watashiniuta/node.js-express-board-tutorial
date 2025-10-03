function saveSessionAndRespond(req, res, callback) {
  req.session.save(err => {
    if (err) {
      console.error('세션 저장 실패:', err);
      return res.status(500).send('세션 저장 실패');
    }
    callback(); // Run the response when done saving the session
  });
}

module.exports = saveSessionAndRespond;