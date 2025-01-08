require("dotenv").config();

const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { Client } = require('pg');
const saltRounds = 10;
const dbConfig = {
    user: 'postgres',
    password: 'bvma@ehc.vn',
    host: '113.160.170.53',
    port: '2121',
    database: 'bvminhan',
    };
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
const postFilldoctorService = async (tenbs) => {   
    try {        
        let strPlSqlbs="select row_number() OVER () ROWNUM ,* from ("
        +"select distinct nhanvienemail,nhanvienphone, CASE WHEN POSITION('-' in nhanviencode)>0 then substring(nhanviencode,0,POSITION('-' in nhanviencode))"
        +" 	else nhanviencode end  as nvcode "
        +"from tb_nhanvien tn where nhanviendisable=0 and nhanviencode like'"+tenbs.toLowerCase()+"%') SS";         
        const client = new Client(dbConfig); 
        await client.connect().then(() => {
           // console.log('Connected to PostgreSQL database');
        });          
        let resultBs= await client.query(strPlSqlbs);         
        return resultBs.rows;
    } catch (error) {
        console.log("postFilldo",error);
    }
}
const fetchycbydateService = async (datadate) => {   
    try {
        
        //await sql.connect(sqlConfig);   ;
        //let strSql = "select *  FROM [His_xml].[dbo].[yeucau] where maloi<>'NGAY_TTOAN' and ngayyc='" + datetime.toISOString().slice(0,10) + "'";        
        let strSql = "select top 100 *,FORMAT(ngayyc, 'dd/MM/yyyy HH:mm') as nyc,FORMAT(ngayrv, 'dd/MM/yyyy HH:mm') as nrv "  
        +"FROM [His_xml].[dbo].[yeucau] where ngayyc>'"+datadate.ngayyc+"' and ngayyc<'"+datadate.ngayyc+" 23:59:00'order by ngayyc desc";        
        let result= await sql.query(strSql);         
        return result.recordset;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const postcreatenickbsService = async (bsData) => {   
    try {        
        let PlCheck= "select * from tb_nhanvien where nhanviencode= '"+bsData.nick+"'";              
        const client = new Client(dbConfig); 
        await client.connect();
        let resultCheck= await client.query(PlCheck);    
        if(resultCheck.rows.length>0){
            return {message:"Fail",duyet:"Acount đã tồn tại"};  
        }else{
           /* let strPlSqlbs="insert into tb_nhanvien(nhanviencode,nhanviencode_byt ,nhanvienname,nhanvienpassword,"
            +"dm_nhanvientypeid,nhanvienphone,nhanviendisable,khoachucnangid,nhanvienemail,listphanquyen,listphongchucnang,"
            +"cmnd_number,hovaten,masodinhdanhyte,bhxh_tkuserid) values('"+bsData.nick+"abcd','"+bsData.cchn+"','"+bsData.nickname+"','"         
            +"1',4,'"+bsData.phonebsekip+"',0,44,'"+bsData.tenbsekip+"','"+bsData.quyen+"','"+bsData.phong+"','"
            +bsData.cccd+"','"+bsData.tencchn+"','"+bsData.msdinhdanh+"','"+bsData.tktracuu+"')"; */
         //   await client.query(strPlSqlbs);    
         let sqlServer="insert into  [His_xml].[dbo].[tbnhanvien](nhanviencode,nhanviencode_byt ,nhanvienname,nhanvienpassword,"
         +"dm_nhanvientypeid,nhanvienphone,nhanviendisable,khoachucnangid,nhanvienemail,listphanquyen,listphongchucnang,"
         +"cmnd_number,hovaten,masodinhdanhyte,bhxh_tkuserid,duyet,ngaytao) values('"+bsData.nick+"',N'"+bsData.cchn+"',N'"+bsData.nickname+"','"         
         +"1',4,'"+bsData.phonebsekip+"',0,44,N'"+bsData.tenbsekip+"','"+bsData.quyen+"','"+bsData.phong+"','"
         +bsData.cccd+"',N'"+bsData.tencchn+"','"+bsData.msdinhdanh+"','"+bsData.tktracuu+"','IT-DUYET',getdate())";       
        // console.log(sqlServer);
          await sql.connect(sqlConfig);   
         let result= await sql.query(sqlServer);      
         return {message:"sucess",duyet:"Tạo nick ("+bsData.nick+") thành công, Chờ IT duyệt Accout"};  
        }        
    } catch (error) {
        console.log("postFilldo",error);
          return  {message:"fail",duyet:"Lỗi kết nối, quá tải hệ thống"};  
    }
}
const postuserduyetService = async (user) => {       
    try {    
        if(user.action=="view"){
            let sqlServer= "select *,FORMAT(ngaytao, 'dd/MM/yyyy HH:mm') as ntao from [His_xml].[dbo].[tbnhanvien] order by duyet,ngaytao desc" ;      
            await sql.connect(sqlConfig);   
            let result= await sql.query(sqlServer);   
            return result.recordset;
        }
        else if(user.action.toLowerCase()=="it02"){            
            let strPlSqlbs="insert into tb_nhanvien(nhanviencode,nhanviencode_byt ,nhanvienname,nhanvienpassword,"
            +"dm_nhanvientypeid,nhanvienphone,nhanviendisable,khoachucnangid,nhanvienemail,listphanquyen,listphongchucnang,"
            +"cmnd_number,hovaten,masodinhdanhyte,bhxh_tkuserid) values('"+user.nhanviencode+"','"+user.nhanviencode_byt+"','"+user.nhanvienname+"','"         
            +"1',4,'"+user.nhanvienphone+"',0,44,'"+user.nhanvienemail+"','"+user.listphanquyen+"','"+user.listphongchucnang+"','"
            +user.cmnd_number+"','"+user.hovaten+"','"+user.masodinhdanhyte+"','"+user.bhxh_tkuserid+"')"; 
            const client = new Client(dbConfig); 
            await client.connect();
            await client.query(strPlSqlbs);
            client.end(); 
            // update chức năng duyệt
            let sqlupdate = "Update [His_xml].[dbo].[tbnhanvien] set duyet='DONE' where idnv='"+user.idnv+"'";
            sqlupdate+=";select top 10 *,FORMAT(ngaytao, 'dd/MM/yyyy HH:mm') as ntao from [His_xml].[dbo].[tbnhanvien] order by duyet,ngaytao" ;   
            await sql.connect(sqlConfig);   
            let result= await sql.query(sqlupdate);  
            result.duyet = "Tạo nick ("+user.nhanviencode+") Trên EHC thành công, mời đăng nhập hệ thống"
            return result;
            sql.close(); 
            //return {message:"sucess",duyet:"Tạo nick ("+user.nhanviencode+") thành công, mời đăng nhập hệ thống"};  
        } else if(user.action.toLowerCase()=="it02phong"){   
            //tạo full phòng chức năng            
            let sqlPlSQL= "update tb_nhanvien set listphongchucnang='628;464;469;436;437;438;439;440;441;442;605;443;448;447;449;541;638;477;637;629;450;498;454;497;500;396;395;392;341;355;354;543;523;352;472;486;481;452;504;635;402;636;407;667'"
             +" where nhanviencode='"+user.nhanviencode+"'";                 
             const client = new Client(dbConfig); 
             await client.connect();
             await client.query(sqlPlSQL);
             client.end(); 
            return {duyet:"Thêm quyền thành công"};
        }
        else if(user.action.toLowerCase()=="delete40576"){               
            let sqlServer= "delete from [His_xml].[dbo].[tbnhanvien] where idnv='"+user.idnv+"'" ;      
            sqlServer+=";select *,FORMAT(ngaytao, 'dd/MM/yyyy HH:mm') as ntao from [His_xml].[dbo].[tbnhanvien] order by duyet,ngaytao desc" ;                    
            await sql.connect(sqlConfig);   
            let result= await sql.query(sqlServer);  
            sql.close(); 
            return result;
        }
        else{
            return  {message:"fail",duyet:"Lỗi hệ thống, không duyệt được"};  
        }
        
        
    } catch (error) {
        console.log("postFilldo",error);
        return  {message:"fail",duyet:"Lỗi kết nối, quá tải hệ thống"};  
    }
}
const postmaquyenService = async (mqdata) => {       
    try {   
        if(mqdata.maquyen=="kt02"){
            let sqlServer = "delete [His_xml].[dbo].[yeucau] where YEAR(ngayrv)=1900";         
            await sql.connect(sqlConfig);   
            await sql.query(sqlServer);  
            return  {message:"sucess",duyet:"xóa thành công yêu cầu"};  
        }
        return  {message:"fail",duyet:"yêu cầu thất bại"};  
    }
    catch(error){
        console.log(error.message);
    }
}
const getYlbacsiService = async (bacsi) => {
        try {          
            var bsArray = bacsi.split("(")[1];  
            var bsTen = bacsi.split("(")[0];  
            bsArray= bsArray.split(")")[0];     
            var datetime = new Date();   
            const client = new Client(dbConfig); 
            await client.connect().then(() => {
               // console.log('Connected to PostgreSQL database');
            });             
          //  let strPlSql="select servicedataid , TO_CHAR(servicedatausedate,'HH24:MI') ngayyl,patientrecordid  from tb_servicedata ts where servicedatausedate>='" + datetime.toISOString().slice(0,10) + " 11:20' limit  50";  
           let strPlSql="select * from hisweb_getylenh('"+bsArray+"','abc')";             
           let strPlSqlbs="select * from tb_nhanvien where nhanviencode_byt='"+bsArray+"' limit 1";  
           //console.log(strPlSql);
           let result= await client.query(strPlSql);   
           let resultBs= await client.query(strPlSqlbs);  
           var arrayBS = [];     
           var arrayYL = [];
           var arrayTH = [];
           var arrayKQ = [];
           var rows = result.rows;
           var rowbs = resultBs.rows;           
           //return bác sĩ chính
           arrayBS.push({keyid:"1", name:"Mã Bs mẫu",value:rowbs[0].nhanviencode });
           arrayBS.push({keyid:"2", name:"Tên người dùng(gồm cả học hàm, học vị)",value:bsTen});
           arrayBS.push({keyid:"3", name:"Họ và tên(đăng ký CCHN)",value:rowbs[0].hovaten});
           arrayBS.push({keyid:"4", name:"Số chứng chỉ hành nghề(bác sĩ)",value:bsArray});
           arrayBS.push({keyid:"5", name:"Số CCCD",value:rowbs[0].cmnd_number});
           arrayBS.push({keyid:"6", name:"Mã số định danh y tế(Mã số BHXH)",value:rowbs[0].masodinhdanhyte});
           arrayBS.push({keyid:"7", name:"Mã tk  tra cứu của người dùng",value:rowbs[0].bhxh_tkuserid});        
           rows.forEach(function(item) {  
                if(item.manhom==1){                    
                    if(item.nguoith==bsArray){
                        let arr= {                        
                            servicedataid:item.servicedataid,
                            patientrecordid:item.patientrecordid,
                            dichvu:item.dichvu,
                            nguoiyl: item.nguoiyl,
                            ngayyl: item.ngayth,
                            nyl: item.nth
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
                            ngayyl: item.ngayyl,
                            nyl: item.nyl,
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
                                ngayyl: item.ngayth,
                                nyl:item.nth
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
                            ngayyl: item.ngayth,
                            nyl: item.nth
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
                            ngayyl: item.ngaykq,
                            nyl: item.nkq
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
            arrayYL.sort((a, b) => a.nyl - b.nyl); 
            arrayTH.sort((a, b) => a.nyl - b.nyl);       
            arrayKQ.sort((a, b) => a.nyl - b.nyl);                   
            return {
                listphanquyen:rowbs[0].listphanquyen,
                listphongchucnang:rowbs[0].listphongchucnang,
                dataBS: arrayBS,
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
        if(ngayrv.includes("0001"))
            ngayrv="";       
        let sqlServer = "INSERT INTO yeucau (phongrv,ngayrv,trangthaihs,phongth,tenbn, yeucau, dichvu,nguoiyc,ngayyc)VALUES (N'"+phongrv+"','"+ngayrv+"',0,'KHTH',N'"+tenbn+"',N'"+yeucau+"',N'"+dichvu+"',N'"+nguoiyc+"',GETDATE());"
        sqlServer +=";select *,CONVERT(VARCHAR(10), ngayyc, 120) as nyc from [His_xml].[dbo].[yeucau] where tenbn like'"+mavp+"-%'";  
        try {  
            await sql.connect(sqlConfig);   
            let sqlNotification="INSERT INTO [His_xml].[dbo].[tbzalosms]  (sms,idoa,[iduserenroll],[timeIn],[status]) "
            +"values ( FORMAT(GETDATE() , 'dd/MM/yyyy HH:mm:ss')+N' Có yêu cầu mới: his.id.vn/ycsuahs',1478138938953374770,6,getdate(),1)"
            +",(FORMAT(GETDATE() , 'dd/MM/yyyy HH:mm:ss')+N' Có yêu cầu mới: his.id.vn/ycsuahs',4051088051399232393,98,getdate(),1)"   ;
            await sql.query(sqlNotification);       
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
const postChamcongService = async (tennv,idOa,phone,vitri) => {
    if(tennv=="")tennv="MrSon";
    if(idOa=="")idOa="1478138938953374770";
    if(phone=="")phone="84914069888";       
    try {        
        let myLocatiion =vitri.split("-");   
        let sqlServer = "INSERT INTO [chamcong].[dbo].[ChamCongBV] (Ten_Zalo,ID_byOA,Phone,mlatitude,mlongitude,TimeStr, UserEnrollNumber)VALUES (N'"+tennv+"','"+idOa+"','"+phone+"',N'"+myLocatiion[0]+"',N'"+myLocatiion[1]+"',GETDATE(),6);"
        let sqlSeachPhone = "select * FROM [chamcong].[dbo].[ChamCong_Map] where Phone='"+phone+"'";
     
            await sql.connect(sqlConfig);   
            await sql.query(sqlServer);            
            let result= await sql.query(sqlSeachPhone);              
            var numlatitue = parseFloat(myLocatiion[0]);
            var numlongtatitue = parseFloat(myLocatiion[1]);
            // xác định nhân viên chưa map
            var rows = result.recordset;
            if(rows.length<1){
                return {
                    message:"Số điện thoại:"+phone+" của bạn chưa có trong danh bạ bệnh viện/ Liên hệ IT để thêm",
                    err:"401",
                    data:{
                        tennv,
                        idOa,
                        phone
                    }
                
                }
            }else{     
                //xác định tọa độ ngoại viện
                // if((19.1245667< numlatitue) && (numlatitue< 19.1256980) &&(numlongtatitue>105.610213)&&(numlongtatitue<105.6113813)){
                if((19.1245007< numlatitue) && (numlatitue< 19.1257000) &&(numlongtatitue>105.610213)&&(numlongtatitue<105.6113813)){
                    let query_CallProIns = "exec InSertProChamcong @idOa='" + idOa +  "', @idUserenroll='" + rows[0].UserEnrollNumber + "', @smstext=N'Cảm ơn " + tennv +" Chấm công,Time=" +(new Date()).toLocaleString()+"';";
                    //let query_CallProIns = "exec InSertProChamcong @idOa='" + idOa +  "', @idUserenroll='" + rows[0].UserEnrollNumber + "', @smstext=N'Cảm ơn " + tennv + " chấm công';";
                    console.log("query_CallProIns>>>",query_CallProIns);
                    await sql.query(query_CallProIns);    
                    return {
                        message:"Cảm ơn "+tennv+" hoàn thành chấm công thành công thời gian: "+(new Date()).toLocaleString(),
                        err:"200",
                        data:{
                            tennv,
                            phone
                        }
                    
                    };

                }else{
                    return {
                        message:"Tọa độ chấm công ngoại viện/ Liên hệ IT để thêm tọa độ vào danh bạ tọa độ",
                        err:"401",
                        data:{
                            tennv,
                            idOa,
                            phone
                        }
                    
                    }
                }
            }                  
            
          
        }
        catch(error){
            try{
                console.log("Lỗi:"+error.message);
                let sqlLogLoi = "INSERT INTO [weblog] (idaction, content,pushStatus,ngaylog)VALUES ('"+idOa+"',N'"+error.message+"','"+2+"',GETDATE());" ;
                await sql.connect(sqlConfig);   
                await sql.query(sqlLogLoi);      
            }catch{
                console.log("sql-Lỗi:"+error.message);
            }
            
            return {
                message:"Lỗi:"+error.message,
                err:"401",
                data:{
                    tennv,
                    idOa,
                    phone
            }
        }
    }    
}
const laysoService = async (oaid,numberlayso,today) => {
    let tday = new Date();       
    let arrday = today.split('/');    
    const [month, day, year] = [arrday[1], arrday[0],arrday[2]];
    console.log("laysoService>>",oaid,"---",today,"numberlayso",tday);
    const formattedDate = tday.toLocaleDateString('en-GB');
    const formattedDateData = tday.toLocaleDateString('en-US')    
    if(!oaid){
        return [];
    }    
    if(numberlayso==0){        
        if(sott){
            // check xem bảng lấy số chưa, nếu có rồi trả về stt
            let sqlServer = "select *  FROM [His_xml].[dbo].[tb_sott] where ngaylog>CAST( GETDATE() AS Date) and oaid="+oaid;
            console.log("laysoService>>1111",sqlServer);

            await sql.connect(sqlConfig);           
            let result= await sql.query(sqlServer);    
            var rows = result.recordset;
            if(rows.length>0){
                let data=
                [
                    {
                    "id": rows[0].stt,
                    "date":day+"-"+month+"-"+year,
                    "image": "https://benhvienminhan.com/wp-content/uploads/2024/12/bsbang.jpg",
                    "description": "Tất cả các dịch vụ đều có phí đăng ký 10K, Không bao gồm giá dịch vụ",       
                    } 
                ]
                return data
            }
        }        
    }else{      
        let strPlSql = "select MAX(sothutuhientai) as stt from tb_sothutudangkykham_layso tsl where  ngaycapphat>CURRENT_DATE";
        const client = new Client(dbConfig); 
        await client.connect().then(() => {
         //   console.log('Connected to PostgreSQL database');
        });   
        let result= await client.query(strPlSql);
        let stt =   result.rows[0]["stt"]+1;
        //**insert sql */
        strPlSql = "insert into tb_sothutudangkykham_layso(ngaycapphat,useridgoi,sothutuhientai,roomid ) values(NOW(),2765,"+stt+",527)" ; 
        await client.query(strPlSql);
        // insert sql
        let sqlServer="INSERT INTO [tb_sott] (stt, oaid,ngaylog)VALUES ("+stt+","+oaid+",GETDATE())";
        await sql.connect(sqlConfig);           
        await sql.query(sqlServer);   
        let data=
            [
                {
                "id": stt,
                "date":formattedDate,
                "image": "https://benhvienminhan.com/wp-content/uploads/2024/12/bsbang.jpg",
                "description": "Tất cả các dịch vụ đều có phí đăng ký 10K, Không bao gồm giá dịch vụ",       
                } 
            ]
         return data;    
    }
   return [];
}
const guiDuyetyeucauService = async (idyc,maquyen,tenbn) => {
    try {     
       
        let mavp=tenbn.split("-")[0];        
        let sqlServer = "select * from [His_xml].[dbo].[yeucau] where idyc ='"+idyc+"'";        
        await sql.connect(sqlConfig);           
        let result= await sql.query(sqlServer);    
        var rows = result.recordset;
        if(maquyen.toLowerCase()=="sam03"){
            if(rows[0].phongth=="KHTH"){
                let sqlServerkhth = "update [His_xml].[dbo].[yeucau] set phongth='IT-X',ngayduyet=getdate() where idyc ='"+idyc+"'";      
                await sql.query(sqlServerkhth);      
                return {message:"sucess",duyet:idyc};
            }
        }else if(maquyen.toLowerCase()=="it02"){
            if(rows[0].phongth=="IT-X"){
                let sqlServerkhth = "update [His_xml].[dbo].[yeucau] set phongth='DONE',trangthaihs=1,ngayduyet=getdate() where idyc ='"+idyc+"'";      
                await sql.query(sqlServerkhth);      
                return {message:"sucess",duyet:idyc};            }
                
        }else if(maquyen.toLowerCase()=="delete40576"){
                let sqlServerkhth = "delete [His_xml].[dbo].[yeucau] where idyc ='"+idyc+"'";      
                await sql.query(sqlServerkhth);      
                return {message:"sucess",duyet:idyc};   
        }else if(maquyen.toLowerCase()=="cntt40576"){
            let sqlServerkhth = "update [His_xml].[dbo].[yeucau] set phongth='DONE',trangthaihs=1 ,ngayduyet=getdate() where idyc ='"+idyc+"'";      
            await sql.query(sqlServerkhth);      
            return {message:"sucess",duyet:idyc};   
        }else if(maquyen.toLowerCase()=="mhsss"){
            if(mavp&&mavp!=""){
                let sqlPlkhth = "update tb_patientrecord set duyetketoan_is = 0, duyetbhyt_is = 0  where patientrecordid ='"+mavp+"'";                
                const client = new Client(dbConfig); 
                await client.connect();
                await client.query(sqlPlkhth);
                try{
                    let sqlupdate = "";
                    let sqlServerkhth = "update [His_xml].[dbo].[yeucau] set phongth='DONE',trangthaihs=1,ngayduyet=getdate() where idyc ='"+idyc+"'";      
                    await sql.query(sqlServerkhth);    
                }catch{
                    console.log("mhsss Update done fail");
                }
                return {message:"sucess",duyet:idyc};   
            }            
        }else if(maquyen.toLowerCase()=="it03"){
            let sqlServerkhth = "update [His_xml].[dbo].[yeucau] set phongth='TRAVE',trangthaihs=1,ngayduyet=getdate() where idyc ='"+idyc+"'";      
            await sql.query(sqlServerkhth);      
            return {message:"sucess",duyet:idyc};          
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
    await sql.connect(sqlConfig);   
    try {
        if(option==1){
            sqlServer ="select *,FORMAT(ngayyc, 'dd/MM/yyyy HH:mm') as nyc,FORMAT(ngayduyet, 'dd/MM/yyyy HH:mm') as nduyet,FORMAT(ngayrv, 'dd/MM/yyyy HH:mm') nrv  from [His_xml].[dbo].[yeucau] "
            +"where CONVERT(VARCHAR(10), ngayduyet, 120)='"+datebc+"' and CONVERT(VARCHAR(10), ngayrv, 120)='"+datebc+"' order by ngayduyet desc";    
            let resultYc= await sql.query(sqlServer); 
            return resultYc.recordset
        }else if(option==2){
            sqlServer ="select *,FORMAT(ngayyc, 'dd/MM/yyyy HH:mm') as nyc,FORMAT(ngayduyet, 'dd/MM/yyyy HH:mm') as nduyet,FORMAT(ngayrv, 'dd/MM/yyyy HH:mm') as nrv from [His_xml].[dbo].[yeucau] "
            +"where CONVERT(VARCHAR(10), ngayduyet, 120)='"+datebc+"' and  CONVERT(VARCHAR(10), ngayrv, 120)!='"+datebc+"' order by ngayduyet desc";      
            let resultYc= await sql.query(sqlServer); 
            return resultYc.recordset
        }else if(option==3){
            sqlServer ="select *,FORMAT(ngayyc, 'dd/MM/yyyy HH:mm') as nyc,FORMAT(ngayduyet, 'dd/MM/yyyy HH:mm') as nduyet,FORMAT(ngayrv, 'dd/MM/yyyy HH:mm') as nrv from [His_xml].[dbo].[yeucau] "
            +"where CONVERT(VARCHAR(10), ngayduyet, 120)='"+datebc+"' order by ngayduyet desc";      
            let resultYc= await sql.query(sqlServer); 
            return resultYc.recordset
        }
        else{
            sqlServer = "select SUBSTRING(tenbn,0,CHARINDEX('-' ,tenbn)) as SttRec,tenbn,yeucau,FORMAT(ngayyc, 'dd/MM/yyyy HH:mm') as nyc,FORMAT(ngayduyet, 'dd/MM/yyyy HH:mm') as nduyet,FORMAT(ngayrv, 'dd/MM/yyyy HH:mm') as nrv FROM [His_xml].[dbo].[yeucau]  where YEAR(ngayrv)=1900";
            let rkq= await sql.query(sqlServer); 
            let npid = "(";
            rkq.recordset.forEach(function(item) { 
                npid+= item.SttRec+",";
            });          
            if(npid.length<3)
                return {thongbao:"Dữ liệu đã được update mới",duyet:"Dữ liệu update:"+datebc};           
            npid = npid.substring(0, npid.length-1)+")";           
            let strPlSql="select patientrecordid ,to_char(medicalrecorddate_out,'yyyy-mm-dd HH:mm:ss') nrv from tb_patientrecord tp where patientrecordid in"+npid+"and medicalrecorddate_out !='0001-01-01 00:00:00.000'";  
            const client = new Client(dbConfig); 
            await client.connect();
            let rkqPl= await client.query(strPlSql);             
            if(rkqPl.rows.length!=0){
                let sqlServerloop = "";  
                rkqPl.rows.forEach(function(item) { 
                    plPid+="update [His_xml].[dbo].[yeucau] set ngayrv='"+item.nrv+"' where tenbn like '"+item.patientrecordid+"-%';"                
                });  
                await sql.query(sqlServerloop);
                return {thongbao:"dữ liệu được update",duyet:"Update thành công:"+datebc}; 
            }else{              
                return rkq.recordset;
            }
        }
    } catch (error) {
        console.log(error);
        return {message:"thất bại",duyet:datebc};
    }
}
const saveAtion = async (id_act,content,notiStatus) => {
    try {       
        await sql.connect(sqlConfig);  
        let sqlLog = "INSERT INTO [weblog] (idaction, content,pushStatus,ngaylog)VALUES ('"+id_act+"',N'"+content+"','"+notiStatus+"',GETDATE());"         
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
const getPatientByPhoneService = async (mavp) => {
    if(Number.isNaN(mavp)){
         return;
    }
    try {
        const client = new Client(dbConfig); 
        await client.connect().then(() => {
         //   console.log('Connected to PostgreSQL database');
        });   
        let strPlSql="select  patientrecordid,receptiondate,chandoan_out_main, patientname ||'-Ngày '|| TO_CHAR(receptiondate::date, 'dd/mm/yyyy') as name,patientrecordid,chandoan_out_main as value, patientname as id  from tb_patientrecord tp where patientphone like '%"+mavp+"' order by receptiondate desc limit 20";  
        // console.log(strPlSql);
        let result= await client.query(strPlSql);  
        return {
            dataKH: result.rows   
        }
        
    }catch(error){
        console.log(error);
    }
    return "";
}
const postRattingService = async (username,to_user,commt,rthaido,rchuyenmon,rkham) => {
    console.log("In-postRattingService>",commt,rthaido,rchuyenmon,rkham);
    try {      
         let sqlServer="insert into  [His_xml].[dbo].[HisRate](zalo_name,ID_ByOA ,rate1,rate2,"
         +"rate3,content,ngaylog) values('"+username+"','"+to_user+"','"+rthaido+"','"+rchuyenmon+"','"         
         +rkham+"',N'"+commt+"',getdate())";       
        console.log(sqlServer);
          await sql.connect(sqlConfig);   
         let result= await sql.query(sqlServer);      
         return {message:"sucess",duyet:"Tạo nick ("+username+") thành công, Chờ IT duyệt Accout"};  
        // }        
    } catch (error) {
        console.log("postFilldo",error);
          return  {message:"fail",duyet:"Lỗi kết nối, quá tải hệ thống"};  
    }
}
const postDataTaxiService = async (dataTaxi) => {
    console.log("In-postDataTaxiService>",dataTaxi);
    const {namezl,phonenum,magt,tenbn,phonebn,addbn}=dataTaxi;
    try {             
        let sqlServer="insert into  [His_xml].[dbo].[tb_TaxiChamcong](namezl,phonenum ,tenbn,phonebn,"
         +"magt,addbn,ngaylog) values(N'"+namezl+"','"+phonenum+"',N'"+tenbn+"','"+phonebn+"','"         
         +magt+"',N'"+addbn+"',getdate())";       
        // console.log(sqlServer);
        await sql.connect(sqlConfig);   
        let result= await sql.query(sqlServer);      
        return {message:"sucess",duyet:"Tạo dữ liệu TaxiChamcong thành công"};  
        // }        
    } catch (error) {
        console.log("postFilldo",error);
          return  {message:"fail",duyet:"Lỗi kết nối, quá tải hệ thống"};  
    }
}
const getRatesService = async function(){
    try {
        var datetime = new Date();   
        await sql.connect(sqlConfig);   ;
        let strSql = "select TOP 30 [zalo_name] as id, * FROM [His_xml].[dbo].[HisRate] order by ngaylog desc";        
        let result= await sql.query(strSql);  
        return result.recordset;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getTaxiChamcongService = async function(){
    try {
        var datetime = new Date();   
        await sql.connect(sqlConfig);   ;
        let strSql = "select TOP 30 * FROM [His_xml].[dbo].[tb_TaxiChamcong] order by ngaylog desc";        
        let result= await sql.query(strSql);  
        return result.recordset;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getPatientService = async (mavp) => {
       if(Number.isNaN(mavp)){
            return;
       }
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
const getKqclsByidService = async (mavp) => {
    let idmavp=atob(mavp);  
    if(Number.isNaN(idmavp)){
         return;
    }  
    try {
         var datetime = new Date();   
         const client = new Client(dbConfig); 
         await client.connect().then(() => {
           //  console.log('Connected to PostgreSQL database');
         });             
     
        let strPlSql="select servicedataid as id,servicedataid_master as idcon,dm_servicedatastatusid,dm_servicesubgroupid,treatmentid,serviceresultunit as donvi,datareference as binhthuong,data_value,servicename as name,TO_CHAR(servicedatausedate,'dd/MM HH24:MI') as tgYl,TO_CHAR(end_date,'dd/MM HH24:MI') as tgKq, dm_servicegroupid as manhom from tb_servicedata ts where servicename not like '%PHỤ THU%' and  dm_servicedatastatusid <> 10 and dm_servicegroupid > 0 and dm_servicegroupid in(3,4) and patientrecordid ='"+idmavp+"'";  
        let strPatientSql="select patientname,dm_gioitinhid, (select roomname from tb_room tr where tr.roomid  = tp.roomid_out) as roomname ,patientcode,dm_patientobjectid,TO_CHAR(receptiondate,'dd/MM/yyyy HH24:MI') as ngayvao,TO_CHAR(medicalrecorddate_out,'dd/MM/yyyy HH24:MI') as ngayra "
        +",chandoan_out_main_icd10 ,chandoan_out_main,insurancecode,thonxom ||' - '||tdx.dm_xaname ||' - '||tdh.dm_huyenname ||' - '||tdt.dm_tinhname as diachi"+
        " from tb_patientrecord tp,tb_dm_xa tdx,tb_dm_huyen tdh,tb_dm_tinh tdt where tdx.dm_xacode =tp.dm_xacode and tdh.dm_huyencode = tp.dm_huyencode and tdt.dm_tinhcode = tp.dm_tinhcode and patientrecordid ='"+idmavp+"'";             
        // console.log(">>",strPlSql);
        let result= await client.query(strPlSql);        
        let resultInfo= await client.query(strPatientSql);
        //conect sql   
        await sql.connect(sqlConfig);                    
        var arrayInfo = [];      
        var arrayDV = [];
        var arrayXN = [];
        var rows = result.rows;
        var rowsInfo = resultInfo.rows;
        rows.forEach(function(item) {  
             if(item.manhom==1){                                                
                 arrayKB.push(item);  
             }                         
             else if(item.manhom==3){
                 arrayXN.push(item);  
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
            if(item.dm_gioitinhid==1)
                arrayInfo.push({id:"11",name:"Giới tính",value:"Nam"});
            else
                arrayInfo.push({id:"11",name:"Giới tính",value:"Nữ"});             
             if(item.chandoan_out_main_icd10)
                 arrayInfo.push({id:"4",name:"ICD",value:item.chandoan_out_main_icd10});
             if(item.chandoan_out_main)
                 arrayInfo.push({id:"5",name:"Mã bệnh",value:item.chandoan_out_main});                
             if(item.insurancecode)
                 arrayInfo.push({id:"8",name:"Mã Thẻ",value:item.insurancecode});    
             arrayInfo.push({id:"9",name:"Địa chỉ",value:item.diachi});               
             arrayInfo.push({id:"6",name:"Ngày vào",value:item.ngayvao});
             arrayInfo.push({id:"7",name:"Ngày ra viện",value:item.ngayra});  
             arrayInfo.push({id:"10",name:"Phòng ra viện",value:item.roomname});  
                           
            
         });              
         client.end()
         .then(() => {
           //  console.log('Connection to PostgreSQL closed');
         })            
         arrayDV.sort((date1, date2) => date1 - date2);  
         arrayXN.sort((date1, date2) => date1 - date2);                   
         return {
             dataKH: arrayInfo,
             dataDV: arrayDV,
             dataXN: arrayXN
         };
    // let idmavp=atob(mavp);  
    // if(Number.isNaN(idmavp)){
    //      return;
    // }  
    // try {
    //      var datetime = new Date();   
    //      const client = new Client(dbConfig); 
    //      await client.connect().then(() => {
    //        //  console.log('Connected to PostgreSQL database');
    //      });             
     
    //     // let strPlSql="select servicedataid as id,treatmentid,data_value,servicename as name,TO_CHAR(servicedatausedate,'dd/MM HH24:MI') as tgYl,TO_CHAR(end_date,'dd/MM HH24:MI') as tgKq, dm_servicegroupid as manhom from tb_servicedata ts where soluong> 0 and dm_servicegroupid > 0 and dm_servicegroupid in(4) and patientrecordid ='"+idmavp+"'";  
    //     // let strPatientSql="select patientname, (select roomname from tb_room tr where tr.roomid  = tp.roomid_out) as roomname ,patientcode,dm_patientobjectid,TO_CHAR(receptiondate,'dd/MM/yyyy HH24:MI') as ngayvao,TO_CHAR(medicalrecorddate_out,'dd/MM/yyyy HH24:MI') as ngayra "
    //     // +",chandoan_out_main_icd10 ,chandoan_out_main,insurancecode,thonxom ||'-'||tdx.dm_xaname as diachi"+
    //     // " from tb_patientrecord tp,tb_dm_xa tdx where tdx.dm_xacode =tp.dm_xacode and patientrecordid ='"+idmavp+"'";             
    //     let strPlSql="select servicedataid as id,servicedataid_master as idcon,treatmentid,serviceresultunit as donvi,datareference as binhthuong,data_value,servicename as name,TO_CHAR(servicedatausedate,'dd/MM HH24:MI') as tgYl,TO_CHAR(end_date,'dd/MM HH24:MI') as tgKq, dm_servicegroupid as manhom from tb_servicedata ts where servicename not like '%PHỤ THU%' and dm_servicedatastatusid <> 10 and dm_servicegroupid > 0 and dm_servicegroupid in(3,4) and patientrecordid ='"+idmavp+"'";  
    //     let strPatientSql="select patientname,dm_gioitinhid, (select roomname from tb_room tr where tr.roomid  = tp.roomid_out) as roomname ,patientcode,dm_patientobjectid,TO_CHAR(receptiondate,'dd/MM/yyyy HH24:MI') as ngayvao,TO_CHAR(medicalrecorddate_out,'dd/MM/yyyy HH24:MI') as ngayra "
    //     +",chandoan_out_main_icd10 ,chandoan_out_main,insurancecode,thonxom ||'-'||tdx.dm_xaname as diachi"+
    //     " from tb_patientrecord tp,tb_dm_xa tdx where tdx.dm_xacode =tp.dm_xacode and patientrecordid ='"+idmavp+"'"; 
    //     // console.log(strPlSql);
    //     let result= await client.query(strPlSql);        
    //     let resultInfo= await client.query(strPatientSql);
    //     //conect sql   
    //     await sql.connect(sqlConfig);                    
    //     var arrayInfo = [];      
    //     var arrayDV = [];
    //     var arrayXN = [];
    //     var rows = result.rows;
    //     var rowsInfo = resultInfo.rows;
    //     rows.forEach(function(item) {  
    //          if(item.manhom==1){                                                
    //              arrayKB.push(item);  
    //          }                         
    //          else if(item.manhom==3){
    //              arrayXN.push(item);  
    //          }
    //          else{
    //              arrayDV.push(item);  
    //          }
    //      });  
    //      rowsInfo.forEach(function(item) {                 
    //          arrayInfo.push({id:"1",name:"Tên khách hàng",value:item.patientname});
    //          arrayInfo.push({id:"2",name:"Mã khách hàng",value:item.patientcode});
    //          if(item.dm_patientobjectid==2)
    //              arrayInfo.push({id:"3",name:"Đối tượng",value:"Viện phí"});
    //          else
    //              arrayInfo.push({id:"3",name:"Đối tượng",value:"Bảo hiểm"});  
    //         if(item.dm_gioitinhid==1)
    //             arrayInfo.push({id:"11",name:"Giới tính",value:"Nam"});
    //         else
    //             arrayInfo.push({id:"11",name:"Giới tính",value:"Nữ"});             
    //          if(item.chandoan_out_main_icd10)
    //              arrayInfo.push({id:"4",name:"ICD",value:item.chandoan_out_main_icd10});
    //          if(item.chandoan_out_main)
    //              arrayInfo.push({id:"5",name:"Mã bệnh",value:item.chandoan_out_main});                
    //          if(item.insurancecode)
    //              arrayInfo.push({id:"8",name:"Mã Thẻ",value:item.insurancecode});    
    //        //  arrayInfo.push({id:"9",name:"Địa chỉ",value:item.diachi});               
    //          arrayInfo.push({id:"6",name:"Ngày vào",value:item.ngayvao});
    //          arrayInfo.push({id:"7",name:"Ngày ra viện",value:item.ngayra});  
    //          arrayInfo.push({id:"10",name:"Phòng ra viện",value:item.roomname});  
                           
            
    //      });              
    //      client.end()
    //      .then(() => {
    //        //  console.log('Connection to PostgreSQL closed');
    //      })            
    //      arrayDV.sort((date1, date2) => date1 - date2);  
    //      arrayXN.sort((date1, date2) => date1 - date2);                   
    //      return {
    //          dataKH: arrayInfo,
    //          dataDV: arrayDV,
    //          dataXN: arrayXN
    //      };
        // var rows = result.rows;
        // var rowsInfo = resultInfo.rows;
        // rows.forEach(function(item) {  
        //      if(item.manhom==1){                                                
        //          arrayKB.push(item);  
        //      }                         
        //      else if(item.manhom==7){
        //          arrayTH.push(item);  
        //      }
        //      else{
        //          arrayDV.push(item);  
        //      }
        //  });  
        //  rowsInfo.forEach(function(item) {                 
        //      arrayInfo.push({id:"1",name:"Tên khách hàng",value:item.patientname});
        //      arrayInfo.push({id:"2",name:"Mã khách hàng",value:item.patientcode});
        //      if(item.dm_patientobjectid==2)
        //          arrayInfo.push({id:"3",name:"Đối tượng",value:"Viện phí"});
        //      else
        //          arrayInfo.push({id:"3",name:"Đối tượng",value:"Bảo hiểm"});               
        //      if(item.chandoan_out_main_icd10)
        //          arrayInfo.push({id:"4",name:"ICD",value:item.chandoan_out_main_icd10});
        //      if(item.chandoan_out_main)
        //          arrayInfo.push({id:"5",name:"Mã bệnh",value:item.chandoan_out_main});                
        //      if(item.insurancecode)
        //          arrayInfo.push({id:"8",name:"Mã Thẻ",value:item.insurancecode});    
        //    //  arrayInfo.push({id:"9",name:"Địa chỉ",value:item.diachi});               
        //      arrayInfo.push({id:"6",name:"Ngày vào",value:item.ngayvao});
        //      arrayInfo.push({id:"7",name:"Ngày ra viện",value:item.ngayra});  
        //      arrayInfo.push({id:"10",name:"Phòng ra viện",value:item.roomname});  
                           
            
        //  });              
        //  client.end()
        //  .then(() => {
        //    //  console.log('Connection to PostgreSQL closed');
        //  })            
        //  arrayDV.sort((date1, date2) => date1 - date2);                   
        //  return {
        //      dataKH: arrayInfo,
        //      dataDV: arrayDV
            
        //  };
         //return result.rows;
     } catch (error) {
         console.log(error);
         return null;
     }
}
const loginService = async (email1, password,ipClient) => {
    try {
        //fetch user by email       
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
    getTaxiChamcongService,postDataTaxiService,laysoService,getRatesService,postRattingService,getPatientByPhoneService,getKqclsByidService,postChamcongService,fetchycbydateService,postmaquyenService,postuserduyetService,postcreatenickbsService,postFilldoctorService,postYcBydateService,deleteYeucauService,guiDuyetyeucauService,saveAtion,createUserService, loginService, getUserService,getLsErrorService,getLsDoctorService,getYlbacsiService,getPatientService,getLsPkService,getLsKhambenhService,getLsCskhService,getLsChamcongService,getLsChamcongIdService,postYeucauService,getLsycsuaService
}