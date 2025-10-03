const methodOverride = require("method-override");
const compression = require("compression");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const express = require("express");
const helmet = require("helmet");
const ejs = require("ejs");
const app = express();
const port = 3000;
require("dotenv").config();

// CSP operations
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://code.jquery.com", "'unsafe-inline'"],
      scriptSrcAttr: ["'unsafe-inline'"], // JS event handler accpet
      styleSrc: ["'self'", "'unsafe-inline'"], // inline CSS handler accpet
      imgSrc: [
        "'self'",
        "data:", // base64 image accept
        "https://i.imgur.com",
        "https://your-bucket-name.s3.ap-northeast-2.amazonaws.com", // ✅ adding S3 bucket domain
      ],
    },
  })
);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);
app.use(compression());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

const sessionStore = new MySQLStore({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  expiration: 1000 * 60 * 60 * 24,        // Server session data expires after 24 hours
  checkExpirationInterval: 1000 * 60 * 60, // Clear expired sessions every hour
  createDatabaseTable: true
});

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    rolling: true,   // Initialize cookie expiration time whenever a request is received
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 // Cookies are valid for 24 hours
    }
  })
);

//router of index page
const indexRouter = require("./routes/index.js");
//router of board page
const boardRouter = require("./routes/board.js");
//router of myboard
const myboardRouter = require("./routes/myboard2.js");
//router of login page
const loginRouter = require("./routes/login.js");
//router of auth page
const authRouter = require("./routes/auth.js");
//router of myprofile page
const myprofileRouter = require("./routes/myprofile.js");
//router of like toggle
const toggleLikeRouter = require("./routes/toggleLike.js");

app.use("/", indexRouter);
app.use("/board", boardRouter);
app.use("/myboard", myboardRouter);
app.use("/login", loginRouter);
app.use("/auth", authRouter);
app.use("/myprofile", myprofileRouter);
app.use("/like_toggle", toggleLikeRouter);

app.use(function (req, res) {
  res.status(404).send("Sorry can't find that!");
});

app.use(function (error, req, res, next) {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, function () {
  console.log("Example app listening on http://localhost:3000");
});