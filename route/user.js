const express=require("express")
const router=express.Router();
const gravatar=require("gravatar")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const User=require("../model/User.js")
const config=require("../config/config.json")
const validation=require("../validation/uservalidation.js")
const uservalidation=validation.userValidation

router.post('/users',async(req,res)=>{
        let [result, data]=uservalidation(req.body)
        if(!result) return res.status(404).json({data})

        // const user= new User(req.body)
        // const newuser= await user.save()
        // if(newuser){
        //     return res.send("success")

        // }else{
        //     return res.send({err})
        // }
        const {name,email,password}=req.body;
        try{
            //see user exite
            let user = await User.findOne({email });
            if(user){
                res.status(400).json({errors:[{msg:"user already exits"}]})
            }
            //get user gravatera
            const avatar = gravatar.url(email,{
                s:'200',
                r:'pg',
                d:'mm'
            })
            user = new User({
                name,
                email,
                avatar,
                password
            });
            //encrypt password
            const salt = await bcrypt.genSalt(10);

            user.password=await bcrypt.hash(password,salt)

            await user.save();
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