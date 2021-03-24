const express =require("express");
const connectDB=require("./config/db.js")

const app=express()
app.use(express.json({extended:false}));

//connecte database
connectDB();

// defien routes
const auth=require('./route/auth.js')
app.use('/api',auth)
const user = require('./route/user.js')
app.use('/api',user)

// listen for requests
const PORT=process.env.PORT || 7800;

app.listen(PORT, () => 
   console.log("Server is listening on port 7800")
);