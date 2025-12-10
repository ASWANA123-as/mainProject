const express=require('express')
const app=express()
const cors =require("cors") ;
const cookieParser = require("cookie-parser");
require('dotenv').config()
const connectDb=require('./config/db')
const userroute=require('./Routes/UserRoute')
const adminroute=require('./Routes/AdminRoutes')
const organizerroute=require('./Routes/OrganizerRoutes')
const attandeeRoutes=require('./Routes/AttandeeRoutes')
const paymentRoute = require("./Routes/paymentRoute");


connectDb()
app.use(cors({
  origin: "https://main-project-frontend-h644.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE","PATCH", "OPTIONS"],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json())
           // <-- REQUIRED
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.get('/',(req,res)=>{
    res.send('welcome to Event management system system')


})
app.use('/api/attendee',attandeeRoutes)
app.use('/api/organizer',organizerroute)
app.use('/api/auth',userroute)
app.use('/api/admin',adminroute)
app.use("/api/payment", paymentRoute);
app.listen(process.env.PORT , () => {
  console.log(`server is running on ${process.env.PORT}`);
})