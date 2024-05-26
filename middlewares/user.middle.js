const jwt=require("jsonwebtoken")

const auth = (req, res, next) => {
    const token = req.headers.authorization;
    console.log("Token:", token); 
    if (token) {
        try {
            const decoded = jwt.verify(token, "presidio");
            console.log("Decoded:", decoded); 
            if (decoded) {
                req.user = decoded.user;
                req.userId = decoded.userId;
                next();
            } else {
                res.status(401).send({ "msg": "Please Login" });
            }
        } catch (err) {
            console.error("Error verifying token:", err); 
            res.status(401).send({ "msg": "Invalid Token" });
        }
    } else {
        console.log("Token not provided"); 
        res.status(401).send({ "msg": "Token not provided" });
    }
}


module.exports={
    auth
}