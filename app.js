require('dotenv').config();
const express = require("express");
const indexRouter = require("./routes/indexRouter");
const passport = require("passport");
const session = require("express-session");
const { Pool } = require("pg");
const pgSession = require("connect-pg-simple")(session);
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: process.env.connectionString
})

app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    store: new pgSession({
        pool: pool,
        tableName: 'session'
    }),
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(passport.session());

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use("/", indexRouter);

const PORT = process.env.port || 3000;

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`App is listening on port ${PORT}`);
    }
})