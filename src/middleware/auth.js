require("dotenv").config();
const jwt = require("jsonwebtoken");
const { saveAtion } = require("../services/userService");
const Luulog= async (mail, name,ipclient)=>{
    saveAtion(mail,ipclient);
}
const auth = (req, res, next) => {

    const white_lists = ["/", "/register", "/login"];
    if (white_lists.find(item => '/v1/api' + item === req.originalUrl)) {
        next();
    } else {
        if (req?.headers?.authorization?.split(' ')?.[1]) {
            const token = req.headers.authorization.split(' ')[1];

            //verify token
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET)               
                try{
                    if(decoded.ipclient)
                        if(!decoded.ipclient.includes("localhost"))
                            Luulog(decoded.email,decoded.name,req.originalUrl+","+decoded.ipclient);
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