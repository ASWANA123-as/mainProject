const jwt=require('jsonwebtoken')
require('dotenv').config()
exports.authuser=(req,res,next)=>{
console.log("authuser middleware triggerd")
const token=req.cookies?.token || req.headers.authorization?.split(' ')[1]
console.log(token)
if(!token){
    return res.status(400).json({message:"not have token"})
}
try{
    const verified=jwt.verify(token,process.env.SECRET_KEY)
    req.user=verified
    next()
}
catch(err){
    res.status(500).json({message:err.message})
}
}
exports.authorizeRoles=(...roles)=>{
    console.log(roles)
    return(req,res,next)=>{
        console.log(req)
        if(!req.user){
            return res.status(401).json({message:"please log in"})

        }
        console.log(req.user.usertype)

        if(!roles.includes(req.user.usertype)){
            return res.status(400).json({message:"Accessdenied"})
        }
        next()
    }
}