const users = require("../models/users");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { body, validationResult } = require("express-validator");

async function authenticateUser(req, res, next) {
    await passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureMessage: true
    })(req, res, next);
}

const validateUser = [
    body("username").custom(async username => {
        const user = await users.findUserByUsername(username);
        if (user) {
            throw new Error ("That username is already in use");
        }
    }),
    body("password").isLength({ min: 5 }).withMessage("Your password must be at least 5 characters."),
    body("passwordConfirmation").custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage("Passwords do not match")
]

createUser = [
    validateUser,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("signup", {
                title: "Sign up",
                errors: errors.array()
            });
        }
        const { username, fullname } = req.body;
        const membership = 'member';
        // generate a hash of password
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if (err) {
                next(err);
            } else {
                try { 
                    await users.createUser(username, fullname, hashedPassword, membership);
                } catch(err) {
                    next(err);
                }
            }
        })
        req.session.messages = ["You've successfully registered! Please log in."];
        res.redirect("/login");
    }
]

function logoutUser(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

async function postSecretForm(req, res) {
    const user_id = req.user.id;
    if (req.body.secret === 'secret') {
        await users.upgradeToMember(user_id);
        req.session.messages = ["Welcome to the secret club."];
        res.redirect("/");
    } else if (req.body.secret === 'admin') {
        await users.upgradeToAdmin(user_id);
        req.session.messages = ["Welcome to the super secret club."];
        res.redirect("/");
    } else {
        req.session.messages = ["Sorry, that's not quite right. Try again!"];
        res.redirect("/secret");
    }
}

// authentication strategy
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await users.findUserByUsername(username);
            if (!user) {
                return done(null, false, { message: "Incorrect username or password." });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Incorrect password or password." });
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }   
    })
)

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (user_id, done) => {
    try {
        const user = await users.findUserById(user_id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});

module.exports = {
    createUser,
    authenticateUser,
    logoutUser,
    postSecretForm,
};