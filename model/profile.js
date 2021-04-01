const mongoose=require("mongoose")
const user=require('./User.js')
const ProfieSechma= new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user
    },
    company:{
        type:String
    },
    webSite:{
        type:String
    },
    location:{
        type:String

    },
    status:{
        type:String,
        required:true
    },
    skills:{
        type:[String],
        required:true
    },
    bio:{
        type:String
    },
    githubusername:{
        type:String
    },
    experience:[
        {
            title:{
                type:String,
                required:true
            },
            company:{
                type:String,
                required:true
            },
            from:{
                type:String,
                required:true
            },
            to:{
                type:String,
                required:true

            },
        }
    ]
});

module.exports=Profile=mongoose.model("Profile",ProfieSechma)