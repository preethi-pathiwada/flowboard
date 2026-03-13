const jwt = require("jsonwebtoken")

const authMiddleware =  (req, res, next) => {

    try{
        const token = req.headers['authorization']
    if (!token) {
        res.status(403).send("No token provided")
    }
        const jwtToken = token.split(" ")[1]
        const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY)
        req.user = decodedToken
        next()
    }
    catch(err){
        console.log(err)
        res.status(401).json({message:"Unauthorized"})
    }
}

module.exports = authMiddleware