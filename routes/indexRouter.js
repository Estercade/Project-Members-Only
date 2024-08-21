const { Router } = require("express");
const indexController = require("../controllers/indexController");
const authController = require("../controllers/authController");

const indexRouter = Router();

indexRouter.get("/", indexController.getIndex);
indexRouter.get("/signup", indexController.getSignUpForm);
indexRouter.post("/signup", authController.createUser);
indexRouter.get("/login", indexController.getLoginForm);
indexRouter.post("/login", authController.authenticateUser);
indexRouter.get("/logout", authController.logoutUser);
indexRouter.get("/secret", indexController.getSecretForm);
indexRouter.post("/secret", authController.postSecretForm);
indexRouter.get("/post", indexController.getPostMessageForm);
indexRouter.post("/post", indexController.postMessage);
indexRouter.post("/delete/:message_id", indexController.deleteMessage);

indexRouter.use((err, req, res, next) => {
    if (err) {
        res.status(404).send("Oops! 404 Not Found.");
    }
})

module.exports = indexRouter;