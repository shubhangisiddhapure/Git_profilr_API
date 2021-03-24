const express=require("express")
const auth=require("../middelware/auth.js")
const User=require("../model/User.js")
const jwt=require("jsonwebtoken")
const config=require("../config/config.json")
const bycrypt=require("bcryptjs")
const {check,validationResult}=require("express-validator/check")


const router=express.Router();

router.get('/auth',auth,async(req,res) =>{
    try{

        const user = await User.findById(req.user.id).select('-password');
        res.json(user)
    }catch(err){
        console.log(err)
        res.status(500).send('server error')

    }
})

//post api/aut
// autthenticate user & get token


router.post('/auth',[

    check('email','please enter a valid email').isEmail(),
    check('password','please enter valid password').exists()
    ],async(req,res)=>{
     const errors =validationResult(req);
     if(!errors.isEmpty()){
         return res.status(400).json({errors: errors.array()});
     }

    const {email,password}=req.body;
    try{
        //see user exite
        let user = await User.findOne({email });
        if(!user){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]})
        }
        
        const isMatch= await bycrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).json({errors:[{msg:"invalid credentials"}]}) 
        }


        //return jsonwebtoken
        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,
            config.jwtSecret,
            {expiresIn:360000},(err,token)=>{
                if(err)throw err;
                res.json({token});
            });


    }
    catch(err){
        console.log(err)
        res.status(500).send('server error')
    }


})



module.exports=router