const express = require('express');
const { createUser, handleLogin, getUser,  getAccount,getLsError, getLsDoctors, getYlbacsi } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const routerAPI = express.Router();

routerAPI.all("*", auth);

routerAPI.get("/", (req, res) => {
    return res.status(200).json("Hello world api")
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/postbacsi", getYlbacsi);

routerAPI.get("/user", getUser);
routerAPI.get("/lseror", getLsError);
routerAPI.get("/getLsDoctors", getLsDoctors);
routerAPI.get("/account", delay, getAccount);
module.exports = routerAPI; //export default