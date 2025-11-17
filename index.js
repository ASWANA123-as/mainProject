const express=require('express')
const app=express()
const cors =require("cors") ;
const cookieParser = require("cookie-parser");
require('dotenv').config()
const connectDb=require('./config/db')
const userroute=require('./Routes/UserRoute')
const adminroute=require('./Routes/AdminRoutes')

connectDb()

app.use(cookieParser());
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('welcome to task management system system')


})

app.use('/api/auth',userroute)
app.use('/api/admin',adminroute)
app.listen(process.env.PORT , () => {
  console.log(`server is running on ${process.env.PORT}`);
})