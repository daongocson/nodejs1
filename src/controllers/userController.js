const { createUserService, loginService, getUserService,getLsErrorService,getLsDoctorService, getYlbacsiService } = require("../services/userService");

const createUser = async (req, res) => {
    const { name, email, password } = req.body;
    const data = await createUserService(name, email, password);
    return res.status(200).json(data)
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    const data = await loginService(email, password);

    return res.status(200).json(data)
}

const getUser = async (req, res) => {
    const data = await getUserService();
    return res.status(200).json(data)
}
const getYlbacsi = async (req, res) => {
    const {bacsi} = req.body;   
    const data = await getYlbacsiService(bacsi);
    return res.status(200).json(data)
}
const getLsError = async (req, res) => {
    const data = await getLsErrorService(req,res);
    return res.status(200).json(data);
}
const getLsDoctors = async (req, res) => {
    const data = await getLsDoctorService(req,res);
    return res.status(200).json(data);
}
const getAccount = async (req, res) => {

    return res.status(200).json(req.user)
}

module.exports = {
    createUser, handleLogin, getUser, getAccount,getLsError,getLsDoctors,getYlbacsi

}