const { postChamcongService,createUserService, loginService, getUserService,getLsErrorService,getLsDoctorService, getYlbacsiService, getPatientService, getLsPkService, getLsKhambenhService, getLsCskhService, getLsChamcongService, getLsChamcongIdService, postYeucauService, getLsycsuaService, saveAtion, guiDuyetyeucauService, deleteYeucauService, postYcBydateService, postFilldoctorService, postcreatenickbsService, postuserduyetService, postmaquyenService, fetchycbydateService, getKqclsByidService, getPatientByPhoneService, postRattingService, getRatesService, laysoService, postDataTaxiService, getTaxiChamcongService } = require("../services/userService");

const crypto = require("crypto"); //  'crypto';
const logAction = async (id_act,content) => {   
    var os = require("os");    var hostname = os.hostname();      
  
}
const createUser = async (req, res) => {
    const { name, email, password } = req.body; 
    return res.status(200).json({name, email, password})
}
const getMac = (params) => {
    let privateKey="a863956b298ae5e1937335b653a52459";
    const dataMac = Object.keys(params)
    .sort() // sắp xếp key của Object data theo thứ tự từ điển tăng dần
    .map(
        (key) =>
        `${key}=${
            typeof params[key] === "object"
            ? JSON.stringify(params[key])
            : params[key]
        }`,
    ) // trả về mảng dữ liệu dạng [{key=value}, ...]
    .join("&"); // chuyển về dạng string kèm theo "&", ví dụ: amount={amount}&desc={desc}&extradata={extradata}&item={item}&method={method}

    // Tạo overall mac từ dữ liệu
    mac = calculateHMacSHA256(dataMac, privateKey);
    return mac;
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
const postPatientByphone = async (req, res) => {           
    console.log("tesapigetPhone",req.body);
    let {mavp} = req.body;   
   // mavp="84967567638";
    mavp   = mavp.substring(2);
    const data = await getPatientByPhoneService(mavp);    
    return res.status(200).json(data);
}
const postRatting = async (req, res) => {           
    let {desc,data,username} = req.body;   
    // const username="mrson";
    if(!username){
        const idByOa="1";
        mavp="84967567638";
        console.log("tesapipostRatting",desc,data[0].rating,data[1].rating,data[2].rating);
        return  res.status(200).json("");
    }  
    mavp   = mavp.substring(2);
    const datares = await postRattingService(username,idByOa,desc,data[0].rating,data[1].rating,data[2].rating);    
    return res.status(200).json(datares);
}
const postTaxiData = async (req, res) => {           
    console.log("postTaxiData",req.body);
    // let {desc,data,username} = req.body;   
    // const username="mrson";
    // if(!username){
    //     const idByOa="1";
    //     mavp="84967567638";
    //     console.log("tesapipostRatting",desc,data[0].rating,data[1].rating,data[2].rating);
    //     return  res.status(200).json("");
    // }  
    // mavp   = mavp.substring(2);
    // postTaxiData {
    //     namezl: 'namezl',
    //     phonenum: '09282832',
    //     magt: '',
    //     tenbn: 'fdfsdf',
    //     phonebn: '',
    //     addbn: ''
    //   }
      

    const datares = await postDataTaxiService(req.body);    
    return res.status(200).json(datares);
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
const postObtoMac= async (req, res)=>{
    const Object= req.body;       
    let data= getMac(Object);
    return res.status(200).json(data);    
}
const getNotification= async (req, res)=>{
    const Object= req.body;       
    // let data= getMac(Object);
    let data=[
        {
          id: 1,
          image: "logo",
          title: "Chào bạn mới",
          content:
            "Cảm ơn đã sử dụng Server getNotification, bạn có thể dùng ứng dụng này để tiết kiệm thời gian xây dựng",
        },
        {
          id: 2,
          image: "logo",
          title: "Giảm 50% lần đầu mua hàng",
          content: "Nhập WELCOME để được giảm 50% giá trị đơn hàng đầu tiên order",
        },
      ]
    return res.status(200).json(data);    
}
const getDstaxi= async (req, res)=>{
    const Object= req.body;       
    // let data= getMac(Object);
    let data=[
        {
          id: 1,
          image: "logo",
          title: "Hồ sỹ cảnh - Xe 4 chỗ",
          phone:"0977287830",
          content:"Quỳnh Lâm",
        },
        {
          id: 2,
          image: "logo",
          title: "Nguyễn Văn Đoàn - Xe 4 chỗ",
          phone:"0983555174",
          content: "Quỳnh Lâm",
        },{
            id: 3,
            image: "logo",
            title: "Cù Ngọc Long - Xe 4 chỗ",
            phone:"0964097844",
            content: "Quỳnh Đôi",
          },
      ]
    return res.status(200).json(data);    
}
const getCategories= async (req, res)=>{    
    let data=
        [
            {
              "id": "bacsi",
              "name": "Đánh giá bệnh viện",
              "icon": "https://uxwing.com/wp-content/themes/uxwing/download/medical-science-lab/homeopathic-doctor-icon.svg"            
            }         
          
      ]
    return res.status(200).json(data);    
}
const getRates= async (req, res)=>{    
    const data = await getRatesService();
    return res.status(200).json(data);    
}
const getTaxiChamcong= async (req, res)=>{    
    const data = await getTaxiChamcongService();
    return res.status(200).json(data);    
}
const getSott= async (req, res)=>{ 
    const {oaid,numberlayso,today}= req.body;         
    const data = await laysoService(oaid,numberlayso,today);   
    return res.status(200).json(data);        
}
const getProducts= async (req, res)=>{    
    let data=
    [
        {
          "id": 1,
          "name": "Giáo Sư Bàng",
          "price": 10000,
          "image": "https://benhvienminhan.com/wp-content/uploads/2024/12/bsbang.jpg",
          "description": "Tất cả các dịch vụ đều có phí đăng ký 10K, Không bao gồm giá dịch vụ",
          "categoryId": ["abc"],
          "variantId": ["kham"]
        },
        {
          "id": 2,
          "name": "Bác Sĩ Khánh",
          "price": 10000,
          "image": "https://benhvienminhan.com/wp-content/uploads/2020/08/bs-Khanh.png",
          "description": "Tất cả các dịch vụ đều có phí đăng ký 10K, Không bao gồm giá dịch vụ",
          "categoryId": ["abc"],
          "variantId": ["size"]
        },
        {
          "id": 3,
          "name": "Bs Đậu Phi Triều",
          "price": 10000,
          "image": "https://benhvienminhan.com/wp-content/uploads/2020/08/3-1.jpg",
          "description": "Tất cả các dịch vụ đều có phí đăng ký 10K, Không bao gồm giá dịch vụ",
          "categoryId": ["food"],
          "variantId": ["bacsi"]
        },
        {
          "id": 4,
          "name": "Bs.Nguyễn Hồng Quân",
          "price": 10000,
          "image": "https://benhvienminhan.com/wp-content/uploads/2024/12/bsquan.jpg",
          "description": "Tất cả các dịch vụ đều có phí đăng ký 10K, Không bao gồm giá dịch vụ",
          "categoryId": ["juice"],
          "variantId": ["kham"]
        },
        {
          "id": 9,
          "name": "Đăng ký khám BS Khánh",
          "image": "https://benhvienminhan.com/wp-content/uploads/2020/08/bs-Khanh.png",
          "price": 10000,
          "sale": {
            "type": "percent",
            "percent": 0.5
          },
          "description": "Tất cả các dịch vụ đều có phí đăng ký 10K, Không bao gồm giá dịch vụ",
          "categoryId": ["bacsi"],
          "variantId": ["kham"]
        },
        {
          "id": 10,
          "name": "Đăng ký khám GS Bàng",
          "image": "https://benhvienminhan.com/wp-content/uploads/2020/08/gs-bang.png",
          "price": 10000,
          "sale": {
            "type": "percent",
            "percent": 0.5
          },
          "description": "Tất cả các dịch vụ đều có phí đăng ký 10K, Không bao gồm giá dịch vụ",
          "categoryId": ["bacsi"],
          "variantId": ["kham"]
        }  
      ]
    return res.status(200).json(data);    
}
const zaloUpdateOrderStatus= async (req, res)=>{
    const{appId,orderId}=req.body;  
    let privateKey='a863956b298ae5e1937335b653a52459';
    // let appId="3491350673285432173";
    // let orderId="2604263489005100260225969_1734538815999";
    let method="BANK";
    const dataMac = 'appId='+appId+'&orderId='+orderId+'&resultCode=1&privateKey='+privateKey;   

    const hashmac = calculateHMacSHA256(dataMac, privateKey); 
    let body = {
        appId:appId,
        orderId: orderId,
        resultCode: 1,
        mac: hashmac
      }
    // const{appId,orderId,method}=data;

    let jbody=JSON.stringify(body);
    const url= "https://payment-mini.zalo.me/api/transaction/3491350673285432173/bank-callback-payment";
    const resUpdate = await fetch(url, {
    method: 'POST',
    headers: {
    'content-type': 'application/json'         
    },
    body: jbody,
    });  
    const result = await resUpdate.json();

    // const Object= req.body;   
    console.log("postObtoMac_backendMac",jbody);
    // data= getMac(Object);
    return res.status(200).json(result);    
}
const postPaymentNotice = async (req, res) => {  
        const {data,mac} = req.body;
    const{appId,orderId,method}=data;  
    let privateKey='a863956b298ae5e1937335b653a52459';
    // let appId="3491350673285432173";
    // let orderId="2604263489005100260225969_1734504414533";
    // let method="BANK";
    const dataMac = 'appId='+appId+'&orderId='+orderId+'&resultCode=1&privateKey='+privateKey;   

    const hashmac = calculateHMacSHA256(dataMac, privateKey); 
    let body = {
        appId:appId,
        orderId: orderId,
        resultCode: 1,
        mac: hashmac
      }
    let jbody=JSON.stringify(body);
    const url= "https://payment-mini.zalo.me/api/transaction/3491350673285432173/bank-callback-payment";
    const resUpdate = await fetch(url, {
    method: 'POST',
    headers: {
    'content-type': 'application/json'         
    },
    body: jbody,
    });  
    const result = await resUpdate.json();

    // const Object= req.body;   
    console.log("postPaymentNotice_backendMac",jbody);
    // data= getMac(Object);
    return res.status(200).json({
        "returnCode":1,
        "returnMessage":"Thanh toán his thành cônggg"
    });       
    // const {data,mac} = req.body;
    // const{appId,orderId,method}=data;
    // const privateKey ='a863956b298ae5e1937335b653a52459';
    // const datastr = 'appId='+appId+'&orderId='+orderId+'&method='+method;    
    // const hash = crypto.createHmac('sha256', privateKey)
    //                .update(datastr)
    //                .digest('hex');
    // const macno = calculateHMacSHA256(datastr, privateKey);
    // const getmacc = getMac(data,privateKey);
    // console.log("data>>",data,"Compare>>",hash,"macno>>",macno,"getmacc>>",getmacc);
    // if (hash == mac) {
    //     const url= "https://payment-mini.zalo.me/api/transaction/3491350673285432173/bank-callback-payment";
    //   // request hợp lệ      
    //   const dataMac = 'appId='+appId+'&orderId='+orderId+'&resultCode=1&privateKey='+privateKey;   
    //         // "appId={appId}&orderId={orderId}&resultCode={resultCode}&privateKey={privateKey}";
    //   const hashmac = crypto.createHmac('sha256', privateKey)
    //         .update(dataMac)
    //         .digest('hex');    
    //         let body = {
    //             appId:appId,
    //             orderId: orderId,
    //             resultCode: 1,
    //             mac: hashmac
    //           }
    //     let jbody=JSON.stringify(body);
    //     const resUpdate = await fetch(url, {
    //     method: 'POST',
    //     headers: {
    //       'content-type': 'application/json'         
    //     },
    //     body: jbody,
    //   });  
    //   const result = await resUpdate.json();
    //   console.log("successPament>>>1>",result,"key>>",appId,">>",orderId,">",hashmac,"body>>",jbody);
    //   return res.status(200).json({
    //         "returnCode":1,
    //         "returnMessage":"Thanh toán his thành cônggg"
    //     });
    //     // { "returnCode": 1, "returnMessage": "Success" // tuỳ vào đối tác định nghĩa }
    // } else {
    //     return res.status(200).json({"returnCode":0,"returnMessage":"Thanh toán his Lỗiiii"});
    //     // request không hợp lệ
    // }
    // return res.status(200).json("data")
}
const postPayment = async (req, res) => {  
    console.log("postPayment>>>","body",req.body);
    return res.status(200).json("result");    

    // return res.status(200).json("data")
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
    getTaxiChamcong,postTaxiData,getDstaxi,getSott,getRates,postRatting,postPatientByphone,getProducts,getCategories,getNotification,zaloUpdateOrderStatus,postObtoMac,postPayment,postPaymentNotice,postkqclsByid,guiChamcong,fetchycbydate,postmaquyen,postuserduyet,postcreatenickbs,postFilldoctor,postYcBydate,deleteYeucau,guiDuyetyeucau,createUser, handleLogin, getUser, getAccount,getLsError,getLsDoctors,getYlbacsi,getPatient,getLsPhongkham,getLskhambenh,getLsCskh,getLschamcong,getChamcongId,guiYeucau,getLsycsua

}