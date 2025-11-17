const mongoose=require('mongoose')
require('dotenv').config();
const MONGO_URI=process.env.MONGO_URI

const connectdb=async()=>{
try{
    const connect=await mongoose.connect(MONGO_URI)
    console.log(`connection success ${connect.connection.name}`)
}
catch(error){
console.log(error)
}
}
module.exports=connectdb