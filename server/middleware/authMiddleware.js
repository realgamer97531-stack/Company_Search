const jwt = require('jsonwebtoken');

const SECRET =
process.env.JWT_SECRET ||
process.env.SUPER_SECRET_KEY ||
"SUPER_SECRET_KEY";

function verifyToken(req,res,next){

    const token = req.headers.authorization;

    if(!token){

        return res.status(401).json({
            message:'No Token'
        });

    }

    try{

        const decoded = jwt.verify(token,SECRET);

        req.user = decoded;

        next();

    }catch(err){

        return res.status(401).json({
            message:'Invalid Token'
        });

    }

}

module.exports = verifyToken;
