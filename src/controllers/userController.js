const { postChamcongService,createUserService, loginService, getUserService,getLsErrorService,getLsDoctorService, getYlbacsiService, getPatientService, getLsPkService, getLsKhambenhService, getLsCskhService, getLsChamcongService, getLsChamcongIdService, postYeucauService, getLsycsuaService, saveAtion, guiDuyetyeucauService, deleteYeucauService, postYcBydateService, postFilldoctorService, postcreatenickbsService, postuserduyetService, postmaquyenService, fetchycbydateService, getKqclsByidService } = require("../services/userService");

const crypto = require("crypto"); //  'crypto';
const logAction = async (id_act,content) => {   
    var os = require("os");    var hostname = os.hostname();      
  
}
const createUser = async (req, res) => {
    const { name, email, password } = req.body; 
    return res.status(200).json({name, email, password})
}

const handleLogin = async (req, res) => {
    const { email, password,ipClient } = req.body;    
  //  logAction("handleLogin",email+"login at IP-"+ipClient+":"+(new Date()).getMilliseconds());
    const data = await loginService(email, password,ipClient);
    return res.status(200).json(data)
}

const getUser = async (req, res) => {     
    const data = await getUserService();
    return res.status(200).json(data)
}
const deleteYeucau = async (req, res) => {   
    const { idyc, role,tenbn } = req.body;   
    const data = await deleteYeucauService(idyc, role,tenbn);
    return res.status(200).json(data)
}
const getYlbacsi = async (req, res) => {
    const {bacsi} = req.body;      
    const data = await getYlbacsiService(bacsi);
    return res.status(200).json(data)
}
const postFilldoctor = async (req, res) => {   
    const {bacsi} = req.body;       
    const data = await postFilldoctorService(bacsi);
    return res.status(200).json(data)
}
const postcreatenickbs = async (req, res) => {   
    const bsData = req.body;       
    const data = await postcreatenickbsService(bsData);        
    return res.status(200).json(data)
}
const getPatient = async (req, res) => {       
    const {mavp} = req.body;      
    const data = await getPatientService(mavp);    
    return res.status(200).json(data);
}
const postkqclsByid = async (req, res) => {   
    const {mavp} = req.body;      
    const data = await getKqclsByidService(mavp);
    return res.status(200).json(data)
}
const postuserduyet = async (req, res) => {   
    const user = req.body;       
    const data = await postuserduyetService(user);
    return res.status(200).json(data)
}
const postmaquyen = async (req, res) => {   
    const mqdata = req.body;       
    const data = await postmaquyenService(mqdata);
    return res.status(200).json(data)
}

const calculateHMacSHA256 = (data, secretKey) => {
    const hmac = crypto.createHmac("sha256", secretKey);
    hmac.update(data);
    return hmac.digest("hex");
  };
  const guiYeucau = async (req, res) => {      
     const {tenbn,yeucau,dichvu,nguoiyc,ngayrv,phongrv} = req.body;   
      const data = await postYeucauService(tenbn,yeucau,dichvu,nguoiyc,ngayrv,phongrv);     
      return res.status(200).json(data)
  }
  const guiChamcong = async (req, res) => {      
    // { tennv: '', idOa: '', phone: '', vitri: '21.0258773-105.788026' }
     const {tennv,idOa,phone,vitri} = req.body;   
     const data = await postChamcongService(tennv,idOa,phone,vitri);     
     return res.status(200).json(data);
 }
const fetchycbydate = async (req, res) => {   
    const datadate = req.body;      
    const data = await fetchycbydateService(datadate);
    return res.status(200).json(data)
}
const postPayment = async (req, res) => {       
    const {data,mac} = req.body;
    const{appId,orderId,method}=data;
    const privateKey ='a863956b298ae5e1937335b653a52459';
    const datastr = 'appId='+appId+'&orderId='+orderId+'&method='+method;    
    const hash = crypto.createHmac('sha256', privateKey)
                   .update(datastr)
                   .digest('hex');
  
    if (hash == mac) {
        const url= "https://payment-mini.zalo.me/api/transaction/3491350673285432173/bank-callback-payment";
      // request hợp lệ      
      const dataMac = "appId='"+appId+"'&orderId='"+orderId+"'&resultCode=1&privateKey="+privateKey;   
            // "appId={appId}&orderId={orderId}&resultCode={resultCode}&privateKey={privateKey}";
      const hashmac = crypto.createHmac('sha256', privateKey)
            .update(dataMac)
            .digest('hex');    
            let body = {
                appId:appId,
                orderId: orderId,
                resultCode: 1,
                mac: hashmac
              }
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'         
        },
        body: JSON.stringify(body),
      });  
      const result = await res.json();
      console.log("successPament>>>",result,"key>>",appId,">",orderId,">",hashmac)
    } else {
        return "Loitt";
      // request không hợp lệ
    }

    

   
    return res.status(200).json("data")
}
const guiDuyetyeucau = async (req, res) => {   
    const {idyc,maquyen,tenbn} = req.body;     
    const data = await guiDuyetyeucauService(idyc,maquyen,tenbn);
    return res.status(200).json(data)
}
const postYcBydate = async (req, res) => {  
    const {datebc,option} = req.body;     
    const data = await postYcBydateService(datebc,option);
    return res.status(200).json(data)
}
const getLskhambenh = async (req, res) => {   
    const {phongkham} = req.body;       
    const data = await getLsKhambenhService(phongkham);
    return res.status(200).json(data)
}
const getChamcongId = async (req, res) => {      
    const {manv} = req.body;     
    const data = await getLsChamcongIdService(manv);
    return res.status(200).json(data)
}
const getLsError = async (req, res) => {   
    console.log("Chaozalo12>>>");
    const data = await getLsErrorService(req,res);
    return res.status(200).json(data);
}
const getLsycsua = async (req, res) => {   
    const data = await getLsycsuaService();
    return res.status(200).json(data)
}
const getLsPhongkham = async (req, res) => {    
    const data = await getLsPkService(req,res);
    return res.status(200).json(data);
}
const getLsCskh = async (req, res) => {
    logAction("getLsCskh","G-"+(new Date()).getMilliseconds()); 
    const data = await getLsCskhService(req,res);
    return res.status(200).json(data);
}
const getLschamcong = async (req, res) => {     
    const data = await getLsChamcongService(req,res);
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
    postPayment,postkqclsByid,guiChamcong,fetchycbydate,postmaquyen,postuserduyet,postcreatenickbs,postFilldoctor,postYcBydate,deleteYeucau,guiDuyetyeucau,createUser, handleLogin, getUser, getAccount,getLsError,getLsDoctors,getYlbacsi,getPatient,getLsPhongkham,getLskhambenh,getLsCskh,getLschamcong,getChamcongId,guiYeucau,getLsycsua

}