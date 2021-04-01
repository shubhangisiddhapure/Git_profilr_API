const express =require("express");
const connectDB=require("./config/db.js")
var bodyParser = require('body-parser');


const app=express()
app.use(bodyParser.json());
app.use(express.json({extended:false}));

//connecte database
connectDB();

// defien routes
const auth=require('./route/auth.js')
app.use('/api',auth)
const user = require('./route/user.js')
app.use('/api',user)
const profile=require('./route/profile.js')
app.use('/api',profile)
const post=require('./route/post.js')
app.use('/api',post)
// listen for requests
const PORT=process.env.PORT || 7800;

app.listen(PORT, () => 
   console.log("Server is listening on port 7800")
);