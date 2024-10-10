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
        try {
            var datetime = new Date();   
            const client = new Client(dbConfig); 
            await client.connect().then(() => {
                console.log('Connected to PostgreSQL database');
            });             
          //  let strPlSql="select servicedataid , TO_CHAR(servicedatausedate,'HH24:MI') ngayyl,patientrecordid  from tb_servicedata ts where servicedatausedate>='" + datetime.toISOString().slice(0,10) + " 11:20' limit  50";  
           let strPlSql="select * from getYlbacsi('"+bsArray+"','abc')";  
            console.log(strPlSql);
            let result= await client.query(strPlSql);  
            console.log(result.rows);
            client.end()
            .then(() => {
                console.log('Connection to PostgreSQL closed');
            })            
            return {
                dataYL: result.rows,
                dataTH: result.rows,
                dataKQ: result.rows,
            };
            //return result.rows;
        } catch (error) {
            console.log(error);
            return null;
        }
        
       
    } catch (error) {
        console.log(error);
        return null;
    }
}

const loginService = async (email1, password) => {
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
                    name: user.name
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
                        name: user.name
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
    createUserService, loginService, getUserService,getLsErrorService,getLsDoctorService,getYlbacsiService
}