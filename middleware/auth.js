const jwt  = require('jsonwebtoken')

const {StatusCodes} = require('http-status-codes')

const auth =  async (req,res,next)=>{
    const authHeader =  req.headers.authorization
    if(!authHeader || !authHeader.startsWith('Bearer')){
        res.status(StatusCodes.UNAUTHORIZED).json({ 
            msg:"Authantication Invalid"
         })
        
    }
    const token =  authHeader.split(' ')[1]
    try {
        const payload  =  jwt.verify(token,process.env.JWT_SECRET)
        req.user =  {userId:payload.userId}
        next()
    } catch (error) {
        console.log("error:",error)
        res.status(StatusCodes.UNAUTHORIZED).json({ 
            msg:"Authantication Invalid"
         })
        throw new Error('Authantication Invalid')
    }
}
module.exports= auth;