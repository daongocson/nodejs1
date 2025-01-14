require("dotenv").config();
const jwt = require("jsonwebtoken");
const { saveAtion } = require("../services/userService");
const Luulog= async (mail, name,ipclient,api)=>{
    if(!mail.includes("thaolv")){
        if(ipclient.length>145)
            ipclient=ipclient.substring(0,145);
        if(api.includes("postycsua"))
            saveAtion(mail,ipclient,2);
        else
            saveAtion(mail,ipclient,2);
    }
       
}
const auth = (req, res, next) => {
    const white_lists = ["/", "/register", "/login","/postkqcls","/postPayment","/postPaymentNotice","/postObtoMac","/zaloUpdateOrderStatus",
        "/getnotification","/getcategories","/getproducts","/getdoctorrate","/getbvrate","/postRating","/postrating","/getsott","/getdstaxi",
        "/posttaxidata","/gettaxichamcong","/postdkkbacsi","/getDkKham"
    ];
    if (white_lists.find(item => '/v1/api' + item === req.originalUrl)) {
        next();
    } else if(req?.headers["zalo-access-token"]){
        //if trong ds thì next 
        if (req?.headers?.authorization?.split(' ')?.[1]){
            console.log("logzalobody>>>",req.body);
        }
        next();
        // return res.status(200).json("")
    }
    else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];

            //verify token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)               
                try{
                    var strbody="";
                    for (var key in req.body){
                        strbody+=","+req.body[key];
                        var value = req.body[key];                        
                      }                   
                    if(decoded.ipclient){
                        if(!decoded.ipclient.includes("localhost"))
                            Luulog(decoded.email,decoded.name,req.originalUrl+strbody+","+decoded.ipclient,req.originalUrl);
                    }
                        
                }catch(e){};
                
                next();
            } catch (error) {
                return res.status(401).json({
                    message: "Token bị hết hạn/hoặc không hợp lệ"
                })
            }

        } else {
            return res.status(401).json({
                message: "Bạn chưa truyền Access Token ở header/Hoặc token bị hết hạn"
            })
        }
    }
}

module.exports = auth;