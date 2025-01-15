const express = require('express');
const sql = require('mssql');
const { guiChamcong,createUser, handleLogin, getUser,  getAccount,getLsError, getLsDoctors, getYlbacsi, getPatient, getLsPhongkham, getLskhambenh, getLsCskh, getLschamcong, getChamcongId, guiYeucau, getLsycsua, guiDuyetyeucau, deleteYeucau, postYcBydate, postFilldoctor, postcreatenickbs, postuserduyet, postmaquyen, fetchycbydate, postkqclsByid, postPayment, postPaymentNotice, postObtoMac, zaloUpdateOrderStatus, getNotification, getCategories, getProducts, postPatientByphone, postRatting, getRates, getSott, getDstaxi, postTaxiData, getTaxiChamcong, postDkkbacsi, getDkKham, getDsDkkhamBs, postDkKsk } = require('../controllers/userController');
const auth = require('../middleware/auth');
const delay = require('../middleware/delay');
const routerAPI = express.Router();
const { Client } = require('pg');
routerAPI.all("*", auth);
const dbConfig = {
    user: 'postgres',
    password: 'bvma@ehc.vn',
    host: '113.160.170.53',
    port: '2121',
    database: 'bvminhan',
    };
    const sqlConfig = {
        user: 'sa',
        password: '123@lrco',
        server: '113.160.170.53', // You can use 'localhost\\instance' to connect to named instance
        database: 'His_xml',
        options: {
            encrypt: false, // Disable SSL/TLS
          },   
    }
routerAPI.get("/", async(req, res) => {
   // return res.status(200).json("Hello world api")
   try {
      // const client = new Client(dbConfig); 
      // await client.connect();
      let sqlServer = "select * from [His_xml].[dbo].[yeucau]";
      await sql.connect(sqlConfig);    
      let result= await sql.query(sqlServer);    
      var rows = result.recordset;     
      // let strPlSqlbs = "select nhanvienname  from tb_nhanvien tn where nhanviencode ='bshieu-bshai'";      
      // let resultBs= await client.query(strPlSqlbs);        
        // console.log(">>>","resultBs.rows[0].nhanvienname",rows);
       return res.status(200).json("Hello world sql Con111net Database"+rows[0].tenbn);
    } catch (error) {
        return res.status(200).json(">> Erro11r connect to DB");
    //console.log(">>> Error connect to DB: ", error)
    }
})

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.post("/postbacsi", getYlbacsi);
routerAPI.post("/postpatient", getPatient);
routerAPI.post("/posthosobyphone", postPatientByphone);
routerAPI.post("/postkqcls", postkqclsByid);
routerAPI.post("/postPhongkham", getLskhambenh);
routerAPI.post("/postchamcongid", getChamcongId);
routerAPI.post("/postycsua", guiYeucau);
routerAPI.post("/postduyetyc", guiDuyetyeucau);
routerAPI.post("/postchamcong", guiChamcong);
routerAPI.post("/deleteYeucau", deleteYeucau);
routerAPI.post("/postycbydate", postYcBydate);
routerAPI.post("/postfilldoctor", postFilldoctor);
routerAPI.post("/createnickbs", postcreatenickbs);
routerAPI.post("/getuserduyet", postuserduyet);
routerAPI.post("/postmaquyen", postmaquyen);
routerAPI.post("/fetchycbydate", fetchycbydate);
routerAPI.post("/postPaymentNotice", postPaymentNotice);
routerAPI.post("/postPayment", postPayment);
routerAPI.post("/postObtoMac", postObtoMac);
routerAPI.post("/zaloUpdateOrderStatus", zaloUpdateOrderStatus);
routerAPI.post("/postrating", postRatting);
routerAPI.post("/getsott", getSott);
routerAPI.post("/getdkk", getDkKham);
routerAPI.post("/posttaxidata", postTaxiData);
routerAPI.post("/postdkkbacsi", postDkkbacsi);
routerAPI.post("/postdkksk", postDkKsk);

routerAPI.get("/getnotification", getNotification);
routerAPI.get("/getdstaxi", getDstaxi);
routerAPI.get("/getcategories", getCategories);
routerAPI.get("/getdoctorrate", getCategories);
routerAPI.get("/getbvrate", getRates);
routerAPI.get("/gettaxichamcong", getTaxiChamcong);
routerAPI.get("/getdsdkkhambs", getDsDkkhamBs);

routerAPI.get("/getproducts", getProducts);
routerAPI.get("/user", getUser);
routerAPI.get("/getkqcls", getPatient);
routerAPI.get("/lsycsua", getLsycsua);
routerAPI.get("/lseror", getLsError);
routerAPI.get("/getLsDoctors", getLsDoctors);
routerAPI.get("/lsCskh", getLsCskh);
routerAPI.get("/lschamcong", getLschamcong);
routerAPI.get("/getLsPhongKham", delay, getLsPhongkham);
routerAPI.get("/account", delay, getAccount);
module.exports = routerAPI; //export default