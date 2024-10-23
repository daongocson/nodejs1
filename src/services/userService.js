require("dotenv").config();

const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { Client } = require('pg');
const saltRounds = 10;

const createUserService = async (name, email, password) => {
    try {
        //check user exist
        const user = await User.findOne({ email });
        if (user) {
            console.log(`>>> user exist, chọn 1 email khác: ${email}`);
            return null;
        }

        //hash user password
        const hashPassword = await bcrypt.hash(password, saltRounds)
        //save user to database
        let result = await User.create({
            name: name,
            email: email,
            password: hashPassword,
            role: "HOIDANIT"
        })
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const dbConfig = {
    user: 'postgres',
    password: 'bvma@ehc.vn',
    host: '113.160.170.53',
    port: '2121',
    database: 'bvminhan',
    };
const getYlbacsiService = async (bacsi) => {
        try {          
            var bsArray = bacsi.split("(")[1];  
            bsArray= bsArray.split(")")[0];  ;     
            console.log("service.. ",bsArray);
            var datetime = new Date();   
            const client = new Client(dbConfig); 
            await client.connect().then(() => {
               // console.log('Connected to PostgreSQL database');
            });             
          //  let strPlSql="select servicedataid , TO_CHAR(servicedatausedate,'HH24:MI') ngayyl,patientrecordid  from tb_servicedata ts where servicedatausedate>='" + datetime.toISOString().slice(0,10) + " 11:20' limit  50";  
           let strPlSql="select * from hisweb_getylenh('"+bsArray+"','abc')";  
           //console.log(strPlSql);
           let result= await client.query(strPlSql);        
           var arrayYL = [];
           var arrayTH = [];
           var arrayKQ = [];
           var rows = result.rows;
           rows.forEach(function(item) {  
                if(item.manhom==1){                    
                    if(item.nguoith==bsArray){
                        let arr= {                        
                            servicedataid:item.servicedataid,
                            patientrecordid:item.patientrecordid,
                            dichvu:item.dichvu,
                            nguoiyl: item.nguoiyl,
                            ngayyl: item.ngayth
                        };                   
                        arrayYL.push(arr);  
                    }
                }                         
                if(item.nguoiyl==bsArray){
                    if(item.manhom!=1&&item.manhom!=3){                      
                        let arr= {                        
                            servicedataid:item.servicedataid,
                            patientrecordid:item.patientrecordid,
                            dichvu:item.dichvu,
                            nguoiyl: item.nguoiyl,
                            ngayyl: item.ngayyl
                        };
                        arrayYL.push(arr);
                    }
                    
                };
                if(item.dichvu=='Thủy châm') return;
                if(item.manhom==5){
                    if(item.nguoith!=null){
                        if(item.nguoith.includes(bsArray)){
                            let arr= {                        
                                servicedataid:item.servicedataid,
                                patientrecordid:item.patientrecordid,
                                dichvu:item.dichvu,
                                nguoiyl: item.nguoith,
                                ngayyl: item.ngayth
                            };                   
                            arrayTH.push(arr);
                        }
                    }                    
                }                
                if(item.nguoith==bsArray){
                    if(item.manhom!=5){
                        let arr= {                        
                            servicedataid:item.servicedataid,
                            patientrecordid:item.patientrecordid,
                            dichvu:item.dichvu,
                            nguoiyl: item.nguoith,
                            ngayyl: item.ngayth
                        };                   
                        arrayTH.push(arr);
                    }                    
                };
                if(item.nguoikq==bsArray){
                    // không lấy kq với nhóm thuốc
                    if(item.manhom!=7){
                        let arr= {                        
                            servicedataid:item.servicedataid,
                            patientrecordid:item.patientrecordid,
                            dichvu:item.dichvu,
                            nguoiyl: item.nguoikq,
                            ngayyl: item.ngaykq
                        };          
                        arrayKQ.push(arr);
                    }
                    
                };                  
            });
                 
          //console.log(array);
            
            client.end()
            .then(() => {
                //console.log('Connection to PostgreSQL closed');
            })    
            arrayYL.sort((date1, date2) => date1 - date2); 
            arrayTH.sort((date1, date2) => date1 - date2);       
            arrayKQ.sort((date1, date2) => date1 - date2);                   
            return {
                dataYL: arrayYL,
                dataTH: arrayTH,
                dataKQ: arrayKQ,
            };
            //return result.rows;
        } catch (error) {
            console.log(error);
            return null;
        }
}
const postYeucauService = async (tenbn,yeucau,dichvu,nguoiyc,ngayrv,phongrv) => {
    try {
        let mavp=tenbn.split("-")[0];
        let sqlServer = "INSERT INTO yeucau (phongrv,ngayrv,trangthaihs,phongth,tenbn, yeucau, dichvu,nguoiyc,ngayyc)VALUES (N'"+phongrv+"','"+ngayrv+"',0,'KHTH',N'"+tenbn+"',N'"+yeucau+"',N'"+dichvu+"',N'"+nguoiyc+"',GETDATE());"
        sqlServer +=";select *,CONVERT(VARCHAR(10), ngayyc, 120) as nyc from [His_xml].[dbo].[yeucau] where tenbn like'"+mavp+"-%'";        
        try {  
            await sql.connect(sqlConfig);   
            let result= await sql.query(sqlServer); 
            return result.recordset;
        }
        catch{
            console.log(error);
            return null;
        }

    } catch (error) {
        console.log(error);
        return null;
    }
}
const guiDuyetyeucauService = async (idyc,maquyen,tenbn) => {
    try {      
        console.log("....mvp",tenbn);
        let mavp=tenbn.split("-")[0];        
        let sqlServer = "select * from [His_xml].[dbo].[yeucau] where idyc ='"+idyc+"'";        
        await sql.connect(sqlConfig);           
        let result= await sql.query(sqlServer);    
        var rows = result.recordset;
        if(maquyen.toLowerCase()=="sam03"){
            if(rows[0].phongth=="KHTH"){
                let sqlServerkhth = "update [His_xml].[dbo].[yeucau] set phongth='IT' where idyc ='"+idyc+"'";      
                await sql.query(sqlServerkhth);      
                return {message:"sucess",duyet:idyc};
            }
        }else if(maquyen.toLowerCase()=="it02"){
            if(rows[0].phongth=="IT"){
                let sqlServerkhth = "update [His_xml].[dbo].[yeucau] set phongth='DONE',trangthaihs=1 where idyc ='"+idyc+"'";      
                await sql.query(sqlServerkhth);      
                return {message:"sucess",duyet:idyc};            }
                
        }else if(maquyen.toLowerCase()=="delete40576"){
                let sqlServerkhth = "delete [His_xml].[dbo].[yeucau] where idyc ='"+idyc+"'";      
                await sql.query(sqlServerkhth);      
                return {message:"sucess",duyet:idyc};   
        }else if(maquyen.toLowerCase()=="cntt40576"){
            let sqlServerkhth = "update [His_xml].[dbo].[yeucau] set phongth='DONE',trangthaihs=1 where idyc ='"+idyc+"'";      
            await sql.query(sqlServerkhth);      
            return {message:"sucess",duyet:idyc};   
        }else if(maquyen.toLowerCase()=="mhsss"){
            if(mavp&&mavp!=""){
                let sqlPlkhth = "update tb_patientrecord set duyetketoan_is = 0, duyetbhyt_is = 0  where patientrecordid ='"+mavp+"'";    
                console.log(">>>mhs",maquyen,sqlPlkhth);  
                const client = new Client(dbConfig); 
                await client.connect();
                await client.query(sqlPlkhth);
                return {message:"sucess",duyet:idyc};   
            }            
        }
        else if(rows[0].phongth=="DONE"){
            return {message:"sucess",duyet:idyc};   
        }
        else{
            return {message:"fail",duyet:idyc};
        }
        
        
    } catch (error) {
        console.log(error);
        return {message:"thất bại",duyet:idyc};
    }
}
const deleteYeucauService = async (idyc,maquyen,tenbn) => {
    try { 
        let mavp=tenbn.split("-")[0];        
        let sqlServer = "delete [His_xml].[dbo].[yeucau] where idyc ='"+idyc+"' and phongth='KHTH'";      
        sqlServer +=";select *,FORMAT(ngayyc, 'dd/MM/yyyy HH:mm') as nyc ,FORMAT(ngayrv, 'dd/MM/yyyy HH:mm') as nrv from [His_xml].[dbo].[yeucau] where tenbn like'"+mavp+"-%'";    
        await sql.connect(sqlConfig);             
        let resultYc= await sql.query(sqlServer); 
        return {           
            dataYC:resultYc.recordset
        };     
       
    } catch (error) {
        console.log(error);
        return {message:"thất bại",duyet:idyc};
    }
}
const postYcBydateService = async (datebc,option) => {   
    let sqlServer="";
    try {

        if(option==1){
            sqlServer ="select *,FORMAT(ngayyc, 'dd/MM/yyyy HH:mm') as nyc,FORMAT(ngayrv, 'dd/MM/yyyy HH:mm') nrv  from [His_xml].[dbo].[yeucau] "
            +"where CONVERT(VARCHAR(10), ngayyc, 120)='"+datebc+"' and CONVERT(VARCHAR(10), ngayrv, 120)='"+datebc+"'";    
        }else{
            sqlServer ="select *,FORMAT(ngayyc, 'dd/MM/yyyy HH:mm') as nyc,FORMAT(ngayrv, 'dd/MM/yyyy HH:mm') as nrv from [His_xml].[dbo].[yeucau] "
            +"where CONVERT(VARCHAR(10), ngayyc, 120)='"+datebc+"' and  CONVERT(VARCHAR(10), ngayrv, 120)!='"+datebc+"'";      
        }
        console.log(sqlServer);      
        await sql.connect(sqlConfig);             
        let resultYc= await sql.query(sqlServer); 
        return resultYc.recordset
        
       
    } catch (error) {
        console.log(error);
        return {message:"thất bại",duyet:datebc};
    }
}
const saveAtion = async (id_act,content) => {
    try {       
        await sql.connect(sqlConfig);  
        let sqlLog = "INSERT INTO [weblog] (idaction, content,ngaylog)VALUES ('"+id_act+"',N'"+content+"',GETDATE());"       
        await sql.query(sqlLog);            
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getLsPkService = async () => {
    try {  
        var datetime = new Date();   
        const client = new Client(dbConfig); 
        await client.connect().then(() => {
            //console.log('Connected to PostgreSQL database');
        });   
        let strPlSql="select roomid ,roomname  from tb_room where dm_roomtypeid=2 and roomdisable =0 and roomid not in ('541','469','628','548','650','666')";  
        let result= await client.query(strPlSql);  
        return result.rows;   
    }
    catch{
        console.log(error);
        return null;
    }
}
const getLsCskhService = async () => {  
    try {  
        await sql.connect(sqlConfig);   ;
        let strSql = "select top 10 idcskh,patientrecordid,ghichu, CONVERT(VARCHAR(10), ngayravien, 120) as ngayra, ngayravien FROM[His_xml].[dbo].[tb_Cskh] where trangthai=4 order by ngayravien Desc";        
        let result= await sql.query(strSql);         
        return result.recordset;
    }
    catch{
        console.log(error);
        return null;
    }
}
const getLsChamcongService = async () => {
    try {  
        await sql.connect(sqlConfig);   ;
        let strSql = "SELECT TOP 200 ROW_NUMBER() OVER (ORDER BY TimeStr) AS RowID, info.[UserEnrollNumber],info.[UserEnrollName],info.[UserFullName],CONVERT(VARCHAR(19), TimeStr, 20) as ngaycham,[TimeDate],info.UserIDD "
        +" FROM [chamcong].[dbo].[CheckInOut] inout,[chamcong].[dbo].[UserInfo] info "
        +" where inout.[UserEnrollNumber]=info.UserEnrollNumber and info.[UserEnrollNumber] not in  (6,98)"
        +" and timeStr> CAST( GETDATE() AS Date ) order by TimeStr DESC" ;
        //DATEADD(mm, DATEDIFF(m,0,GETDATE()),0) order by TimeStr DESC" ;		;
        let result= await sql.query(strSql);  
        return result.recordset;
    }
    catch{
        console.log(error);
        return null;
    }
}
const getLsKhambenhService = async (khambenh) => {
    try {  
        var datetime = new Date();   
        const client = new Client(dbConfig); 
        await client.connect().then(() => {
         //   console.log('Connected to PostgreSQL database');
        });   
        let strPlSql="select roomid from tb_room where dm_roomtypeid=2 and roomname ='"+khambenh+"'";  
        let result= await client.query(strPlSql);          
        let idPk=0;
        result.rows.forEach(function(item) { 
            idPk= item.roomid;
        });
        let sqlPhongkham = "select tm.roomid, tm.dm_medicalrecordstatusid, tp.patientcode,tp.patientrecordid , tp.patientname,tp.dm_patientobjectid,tp.dm_patientrecordtypeid "
        +" from tb_medicalrecord tm,tb_patientrecord tp  where "
        +"tp.patientrecordid=tm.patientrecordid and tm.medicalrecorddate >CURRENT_DATE and tm.medicalrecorddate <CURRENT_DATE+ interval '1' day " 
        +"and tm.roomid in(select roomid from tb_room tr where dm_roomtypeid =2 and roomdisable =0) and tm.roomid=" + idPk;
        let resultPk= await client.query(sqlPhongkham);    
        return resultPk.rows;   
    }
    catch{
        console.log(error);
        return null;
    }
}
const getLsChamcongIdService = async (manv) => {
    try {       
        if(manv== null ||manv==""){            
            return [];
        } 
        else{          
            await sql.connect(sqlConfig);   ;
            let strSql = "SELECT TOP 300 ROW_NUMBER() OVER (ORDER BY TimeStr) AS RowID, info.[UserEnrollNumber],info.[UserEnrollName],info.[UserFullName],CONVERT(VARCHAR(19), TimeStr, 20) as ngaycham,[TimeDate],info.UserIDD "
            +" FROM [chamcong].[dbo].[CheckInOut] inout,[chamcong].[dbo].[UserInfo] info "
            +" where inout.[UserEnrollNumber]=info.UserEnrollNumber and info.[UserEnrollNumber] not in  (6,98) and  inout.[UserEnrollNumber]="+manv
            +" and timeStr> DATEADD(mm, DATEDIFF(m,0,GETDATE()),0) order by TimeStr DESC" ;   
            let result= await sql.query(strSql);  
            return result.recordset;            
        }
      
    }
    catch{
        console.log(error);
        return null;
    }
}
const getPatientService = async (mavp) => {
       try {
            var datetime = new Date();   
            const client = new Client(dbConfig); 
            await client.connect().then(() => {
              //  console.log('Connected to PostgreSQL database');
            });             
        
           let strPlSql="select servicedataid as id,servicename as name,TO_CHAR(servicedatausedate,'dd/MM HH24:MI') as value,dm_servicegroupid as manhom from tb_servicedata ts where servicecodebhyt<> '' and soluong> 0 and dm_servicegroupid > 0 and dm_serviceobjectid in (3, 4) and dm_servicegroupid in(1, 3, 4, 5,7) and patientrecordid ='"+mavp+"'";  
           let strPatientSql="select patientname, (select roomname from tb_room tr where tr.roomid  = tp.roomid_out) as roomname ,patientcode,dm_patientobjectid,TO_CHAR(receptiondate,'dd/MM/yyyy HH24:MI') as ngayvao,TO_CHAR(medicalrecorddate_out,'dd/MM/yyyy HH24:MI') as ngayra "
           +",chandoan_out_main_icd10 ,chandoan_out_main,insurancecode,thonxom ||'-'||tdx.dm_xaname as diachi"+
           " from tb_patientrecord tp,tb_dm_xa tdx where tdx.dm_xacode =tp.dm_xacode and patientrecordid ='"+mavp+"'";             
           //console.log(strPlSql);
           let result= await client.query(strPlSql);        
           let resultInfo= await client.query(strPatientSql);
           //conect sql   
           await sql.connect(sqlConfig);   
           let strYeucauSql="select *,CONVERT(VARCHAR(10), ngayyc, 120) as nyc  from [His_xml].[dbo].[yeucau] where tenbn like '"+mavp+"-%'";   
           let resultYc= await sql.query(strYeucauSql);             
           var arrayInfo = [];
           var arrayKB = [];
           var arrayTH = [];
           var arrayDV = [];
           var rows = result.rows;
           var rowsInfo = resultInfo.rows;
           rows.forEach(function(item) {  
                if(item.manhom==1){                                                
                    arrayKB.push(item);  
                }                         
                else if(item.manhom==7){
                    arrayTH.push(item);  
                }
                else{
                    arrayDV.push(item);  
                }
            });  
            rowsInfo.forEach(function(item) {                 
                arrayInfo.push({id:"1",name:"Tên khách hàng",value:item.patientname});
                arrayInfo.push({id:"2",name:"Mã khách hàng",value:item.patientcode});
                if(item.dm_patientobjectid==2)
                    arrayInfo.push({id:"3",name:"Đối tượng",value:"Viện phí"});
                else
                    arrayInfo.push({id:"3",name:"Đối tượng",value:"Bảo hiểm"});               
                if(item.chandoan_out_main_icd10)
                    arrayInfo.push({id:"4",name:"ICD",value:item.chandoan_out_main_icd10});
                if(item.chandoan_out_main)
                    arrayInfo.push({id:"5",name:"Mã bệnh",value:item.chandoan_out_main});                
                if(item.insurancecode)
                    arrayInfo.push({id:"8",name:"Mã Thẻ",value:item.insurancecode});    
              //  arrayInfo.push({id:"9",name:"Địa chỉ",value:item.diachi});               
                arrayInfo.push({id:"6",name:"Ngày vào",value:item.ngayvao});
                arrayInfo.push({id:"7",name:"Ngày ra viện",value:item.ngayra});  
                arrayInfo.push({id:"10",name:"Phòng ra viện",value:item.roomname});  
                              
               
            });              
            client.end()
            .then(() => {
              //  console.log('Connection to PostgreSQL closed');
            })    
            arrayKB.sort((date1, date2) => date1 - date2); 
            arrayTH.sort((date1, date2) => date1 - date2);       
            arrayDV.sort((date1, date2) => date1 - date2);                   
            return {
                dataKH: arrayInfo,
                dataKB: arrayKB,
                dataTH: arrayTH,
                dataDV: arrayDV,
                dataYC:resultYc.recordset
            };
            //return result.rows;
        } catch (error) {
            console.log(error);
            return null;
        }
}
const loginService = async (email1, password,ipClient) => {
    try {
        //fetch user by email
        console.log(">loginService>>>>>>",ipClient);
        const user = await User.findOne({ email: email1 });
        if (user) {
            //compare password
            const isMatchPassword = await bcrypt.compare(password, user.password);
            if (!isMatchPassword) {
                return {
                    EC: 2,
                    EM: "Email/Password không hợp lệ"
                }
            } else {
                //create an access token
                const payload = {
                    email: user.email,
                    name: user.name,
                    ipclient:ipClient
                }

                const access_token = jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRE
                    }
                )
                return {
                    EC: 0,
                    access_token,
                    user: {
                        email: user.email,
                        name: user.name,
                        ipclient:ipClient
                    }
                };
            }
        } else {
            return {
                EC: 1,
                EM: "Email/Password không hợp lệ"
            }
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getUserService = async () => {
    try {
      
        let result = await User.find({}).select("-password");
        return result;

    } catch (error) {
        console.log(error);
        return null;
    }
}
const {sqlConfig,sql} =require("../config/datasql");
const getLsErrorService = async function(req,res){
    try {
        var datetime = new Date();   
      //  await sql.connect(sqlConfig);   
        await sql.connect(sqlConfig);   ;
        let strSql = "select *  FROM [His_xml].[dbo].[Loi130] where maloi<>'NGAY_TTOAN' and Ngay_Ra='" + datetime.toISOString().slice(0,10) + "'";        
        let result= await sql.query(strSql);  
        return result.recordset;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getLsycsuaService = async function(){
    try {
        var datetime = new Date();  
        await sql.connect(sqlConfig);   ;
        //let strSql = "select *  FROM [His_xml].[dbo].[yeucau] where maloi<>'NGAY_TTOAN' and ngayyc='" + datetime.toISOString().slice(0,10) + "'";        
        let strSql = "select top 100 *,FORMAT(ngayyc, 'dd/MM/yyyy HH:mm') as nyc,FORMAT(ngayrv, 'dd/MM/yyyy HH:mm') as nrv   FROM [His_xml].[dbo].[yeucau] order by ngayyc desc";        
        let result= await sql.query(strSql);  
        return result.recordset;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getLsDoctorService = async function(req,res){
    try {
        var datetime = new Date();        
        await sql.connect(sqlConfig);  
        let strSql = "select distinct TenNV+'('+CCHN+')' as name FROM [His_xml].[dbo].[tb_NhanVien] where TenNV is not null and CCHN <>''";        
        let result= await sql.query(strSql);  
        return result.recordset;
    } catch (error) {
        console.log(error);
        return null;
    }
}
module.exports = {
    postYcBydateService,deleteYeucauService,guiDuyetyeucauService,saveAtion,createUserService, loginService, getUserService,getLsErrorService,getLsDoctorService,getYlbacsiService,getPatientService,getLsPkService,getLsKhambenhService,getLsCskhService,getLsChamcongService,getLsChamcongIdService,postYeucauService,getLsycsuaService
}