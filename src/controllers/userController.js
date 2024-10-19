const { createUserService, loginService, getUserService,getLsErrorService,getLsDoctorService, getYlbacsiService, getPatientService, getLsPkService, getLsKhambenhService, getLsCskhService, getLsChamcongService, getLsChamcongIdService, postYeucauService, getLsycsuaService, saveAtion } = require("../services/userService");
const logAction = async (id_act,content) => {   
    const logAct = await saveAtion(id_act,content);
}
const createUser = async (req, res) => {
    const { name, email, password } = req.body;    
    //const data = await createUserService(name, email, password);
    logAction("createUser","G-"+(new Date()).getMilliseconds());
    return res.status(200).json({name, email, password})
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;    
    logAction("handleLogin",email+"G-"+(new Date()).getMilliseconds());
    const data = await loginService(email, password);
    return res.status(200).json(data)
}

const getUser = async (req, res) => {   
    logAction("getUser","getUser"+"G-"+(new Date()).getMilliseconds()); 
    const data = await getUserService();
    return res.status(200).json(data)
}
const getYlbacsi = async (req, res) => {
    const {bacsi} = req.body;   
    logAction("getYlbacsi",bacsi+"-"+(new Date()).getMilliseconds()); 
    const data = await getYlbacsiService(bacsi);
    return res.status(200).json(data)
}
const getPatient = async (req, res) => {   
    const {mavp} = req.body;   
    logAction("getPatient",mavp+"-"+(new Date()).getMilliseconds()); 
    const data = await getPatientService(mavp);
    return res.status(200).json(data)
}
const guiYeucau = async (req, res) => {   
    const {tenbn,yeucau,dichvu,nguoiyc} = req.body;  
    logAction("guiYeucau",tenbn+"-"+(new Date()).getMilliseconds()); 
    const data = await postYeucauService(tenbn,yeucau,dichvu,nguoiyc);
    return res.status(200).json(data)
}
const getLskhambenh = async (req, res) => {   
    const {phongkham} = req.body;   
    logAction("getLskhambenh",phongkham+"-"+(new Date()).getMilliseconds()); 
    const data = await getLsKhambenhService(phongkham);
    return res.status(200).json(data)
}
const getChamcongId = async (req, res) => {      
    const {manv} = req.body;   
    //logAction("getChamcongId",manv+"-"+(new Date()).getMilliseconds()); 
    const data = await getLsChamcongIdService(manv);
    return res.status(200).json(data)
}
const getLsError = async (req, res) => {
    logAction("getLsError","G-"+(new Date()).getMilliseconds()); 
    const data = await getLsErrorService(req,res);
    return res.status(200).json(data);
}
const getLsycsua = async (req, res) => {
    logAction("getLsycsua","G-"+(new Date()).getMilliseconds());    
    const data = await getLsycsuaService();
    return res.status(200).json(data)
}
const getLsPhongkham = async (req, res) => {
    logAction("getLsPhongkham","G-"+(new Date()).getMilliseconds()); 
    const data = await getLsPkService(req,res);
    return res.status(200).json(data);
}
const getLsCskh = async (req, res) => {
    logAction("getLsCskh","G-"+(new Date()).getMilliseconds()); 
    const data = await getLsCskhService(req,res);
    return res.status(200).json(data);
}
const getLschamcong = async (req, res) => {  
    logAction("getLschamcong","G-"+(new Date()).getMilliseconds()); 
    const data = await getLsChamcongService(req,res);
    return res.status(200).json(data);
}
const getLsDoctors = async (req, res) => {
    logAction("getLsDoctors","G-"+(new Date()).getMilliseconds()); 
    const data = await getLsDoctorService(req,res);
    return res.status(200).json(data);
}
const getAccount = async (req, res) => {
   // logAction("getAccount","getAccount"); 
    return res.status(200).json(req.user)
}

module.exports = {
    createUser, handleLogin, getUser, getAccount,getLsError,getLsDoctors,getYlbacsi,getPatient,getLsPhongkham,getLskhambenh,getLsCskh,getLschamcong,getChamcongId,guiYeucau,getLsycsua

}