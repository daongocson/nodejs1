
const delay = (req, res, next) => {
    setTimeout(() => {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            res.set('Access-Control-Allow-Origin', '*');

            //console.log(">>> check token: ", token)
        }
        next()
    }, 3)
}

module.exports = delay;