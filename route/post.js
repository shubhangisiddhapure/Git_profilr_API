
const express =require("express");
const router = express.Router();
const {check,validationResult}=require("express-validator/check")
const auth =require("../middelware/auth.js")
const User=require("../model/User.js")
const Post=require("../model/post.js")
const Profile=require("../model/profile.js")

//create a post
router.post('/post',[auth,
    [
        check("text","Text is required").not().isEmpty()
    ]
],async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors});
    }

    try{
        const user = await User.findById(req.user.id).select('-password');
        const newPost=new Post({
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        })

        const post= await newPost.save()

        res.json(post);

    }catch(err){
        console.log(err)
        res.status(500).send('sever err')
    } 
})
//get all post
router.get('/post',async (req,res)=>{
    try{
        const posts=await Post.find().sort({date:-1})
        res.json(posts)


    }catch(err){
        consol.log(err)
        res.status(500).send('sever error')
    }

})
//get post by id
router.get('/post/:id',async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        res.json(post)
    }catch(err){
        consol.log(err)
        if(err.kind==="ObjectId"){
            return res.status(404).json({msg:"post not found"})
        }
        res.status(500).send('sever error')
    }

})

// delete a post
router.delete('/post/:id',auth,async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg:"post not found"})
        }
        //check user
        if(post.user.toString() !==req.user.id){
            return res.status(401).send({msg:"Uesr noy authorized"})
        }
        await post.remove()
        res.json({msg:"post removes"})


    }catch(err){
        console.log(err)
        res.status(500).send('sever error')
    }

})

//add like
router.put("/like/:id",auth,async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);

        //check if the post has already been like
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length>0){
            return res.status(400).json({msg:"Post already liked"});
        }

        post.likes.unshift({user:req.user.id});

        await post.save()
        res.json(post.likes)
    }catch(err){
        console.log(err)
        res.status(500).send('sever error')
    }
})


//do unlike
router.put("/unlike/:id",auth,async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);

        //check if the post has already been like
        if(post.likes.filter(like=>like.user.toString()===req.user.id).length===0){
            return res.status(400).json({msg:"Post has not yet been liked"});
        }

        //remove like
        const removeIndex=post.likes
        .map(like=>like.user.toString()
        .indexOf(req.user.id));

        post.likes.splice(removeIndex,1);

        await post.save()
        res.json(post.likes)
    }catch(err){
        console.log(err)
        res.status(500).send('sever error')
    }
})




//create a comment
router.post('/comment/:id',[auth,
    [
        check("text","Text is required").not().isEmpty()
    ]
],async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({errors:errors});
    }

    try{
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment={
            text:req.body.text,
            name:user.name,
            avatar:user.avatar,
            user:req.user.id
        };
        post.comments.unshift(newComment)
        await  post.save();

        res.json(post.comments);

    }catch(err){
        console.log(err)
        res.status(500).send('sever err')
    } 
})



//delete comment of particular post
router.delete("/comment/:id/:comment_id",auth,async(req,res)=>{
    try{
        const post= await Post.findById(req.params.id);
        //pull out comment

        const comment=post.comments.find(comment => comment.id === req.params.comment_id)

        //Make sure comment exists
        if(!comment){
            return res.status(404).json({msg:"Comment does not exists"})
        }

        //check user 
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg:"user not authorized"})    
        }
     //remove comment
     const removeIndex=post.comments
     .map(comment=>comment.user.toString()
     .indexOf(req.user.id));
     
     post.comments.splice(removeIndex,1);

     await post.save()
     res.json(post.comments)

    }catch(err){
        console.log(err)
        res.status(500).send('Sever error')
    }
})
module.exports=router