const users = require("../models/users");
const messages = require("../models/messages");
const bcrypt = require("bcryptjs");

async function getIndex(req, res) {
    const displayMessages = req.session.messages;
    req.session.messages = [];
    const messagesArray = await messages.getAllMessages();
    res.render("index", { title: "Index", user: req.user, displayMessages: displayMessages, messages: messagesArray || [] });
}

function getSignUpForm(req, res) {
    res.render("signup", { title: "Sign Up", user: req.user });
}

function getLoginForm(req, res) {
    // place session messages in a temp variable then clear them
    const displayMessages = req.session.messages;
    req.session.messages = [];
    res.render("login", { title: "Log In", user: req.user, displayMessages: displayMessages });
}

function getSecretForm(req, res) {
    const displayMessages = req.session.messages;
    req.session.messages = [];
    res.render("secret", { title: "Secret", user: req.user, displayMessages: displayMessages });
}

function getPostMessageForm(req, res) {
    if (req.isAuthenticated() && (req.user.membership === 'administrator' | req.user.membership === 'member')) {
        res.render("post", { title: "Post a new message", user: req.user });
    } else {
        req.session.messages = ["Sorry, you don't have access to that."]
        res.redirect("/");
    }
}

async function postMessage(req, res) {
    if (req.isAuthenticated() && (req.user.membership === 'administrator' | req.user.membership === 'member')) {
        const message = req.body.message;
        const date = new Date();
        const user_id = req.user.id;
        await messages.createNewMessage(message, date, user_id);
        res.redirect("/");
    } else {
        req.session.messages = ["Sorry, you don't have access to that."]
        res.redirect("/");
    }
}

async function deleteMessage(req, res) {
    if (req.isAuthenticated() && req.user.membership === 'administrator') {
        const message_id = req.params.message_id;
        await messages.deleteMessageById(message_id);
        res.redirect("/");
    } else {
        req.session.messages = ["Sorry, you don't have access to that."]
        res.redirect("/");
    }
}

module.exports = {
    getIndex,
    getSignUpForm,
    getLoginForm,
    getSecretForm,
    getPostMessageForm,
    postMessage,
    deleteMessage
};