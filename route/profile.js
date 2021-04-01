
const express=require("express")
const router = express.Router()
const auth=require("../middelware/auth.js")
const {check,validationResult}=require("express-validator/check")
const Profile =require("../model/profile.js")
const User=require("../model/User.js")
const validation=require("../validation/profilevalidation.js")
const profilevalidation=validation.profileValidation
//creat profile
router.post('/profile',auth, async(req,res)=>{
    let [result, data]=profilevalidation(req.body)
    if(!result) return res.status(404).json({data})
    const{company,webSite,location,status,skills,bio, githubusername}=req.body;
    //Build profile object
    const profileFields={};

    profileFields.user=req.user.id;
    if(company) profileFields.company=company;
    if(webSite) profileFields.webSite=webSite;
    if(location) profileFields.location=location;
    if(status) profileFields.status=status;
    if(githubusername) profileFields.githubusername=githubusername;
    if(bio) profileFields.bio=bio;
    if(skills) {
        profileFields.skills=skills.split(',').map(skill=>skill.trim());
    }
    try{
        let profile=await Profile.findOne({user:req.body.id})
        if(profile){
            //upadate
            profile=await Profile.findOneAndUpdate({user:req.body.id},
                {set:profileFields},
                {new:true});
            return res.json(profile)
        }
        //create 
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile)
    }catch(err){
        console.log(err)
        res.status(500).send('server error');
    }
})


//get profile of all user
router.get('/profile',async(req,res)=>{
    try{
        // console.log(name,avatar)
        const profile= await Profile.find().populate('user',["name","avatar"]);
        
        

        res.json(profile);
    }
    catch(err){
        console.log(err)
        res.status(500).send("sever error")
    }
})

//get profile by user_id
router.get('/profile/:user_id',async(req,res)=>{
    try{

        const profile= await Profile.findOne({user:req.params.user_id}).populate('user',["name","avatar"]);
        
         if(!profile){
             return res.status(400).json({msg:"There is no profile of this user"});
             }

        res.json(profile);
    }
    catch(err){
        console.log(err)
        if(err.kind=='ObjectId'){
            return res.status(400).json({msg:"Profie not found"})
        }
        res.status(500).send("sever error")
    }
})



//Delete profile
router.delete('/',auth,async(req,res)=>{
    try{
        //remove user posts

        //remove profile
        await Profile.findOneAndRemove({user:req.user.id})
        //user delet
        await User.findOneAndRemove({_id:req.user.id})
        res.json({msg:"User remove"})
    }catch(err){
        console.log(err)
        res.status(500).send("sever error")
    }
})

//update profile with experience
router.put('/profie_exprience', auth,[
    check('title','Title is required').not().isEmpty(),
    check('company','company is requried').not().isEmpty(),
    check('from','Frrom date is requried').not().isEmpty()
] 
,async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
     return  res.status(400).json({errors:errors})   
    }
    const{
        title,
        company,
        from,
        to
    }=req.body
    const newExp={
        title,
        company,
        from,
        to
    }
    try{
        const profile= await Profile.findOne({user:req.user.id})
        profile.experience.unshift(newExp)

        await profile.save()
        res.json("experince added")
    }catch(err){
        console.log(err)
        res.status(500).send('server Error')
    }
})



module.exports=router;