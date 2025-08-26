const bcrypt = require("bcrypt");

exports.hashPassword = (password) => bcrypt.hash(password, 10);
exports.comparePassword = (inputPassword, hash) => bcrypt.compare(inputPassword, hash);