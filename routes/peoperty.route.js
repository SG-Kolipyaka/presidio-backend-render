const { Router } = require("express");
const { PropertyModel } = require("../model/property.model");
const multer = require("multer");
const {auth}=require("../middlewares/user.middle")

const propertyRouter = Router();

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

propertyRouter.post('/add', auth, upload.single('image'), async (req, res) => {
    try {
        const { place, area, housetype, no_bedrooms, no_bathrooms, area_size, nearby_railwaystation, nearby_Hospital, description,like,image } = req.body;
        if (!req.user || !req.userId) {
            return res.status(401).send({ "msg": "User not authenticated" });
        }

        const newPost = new PropertyModel({
            place,
            area,
            housetype,
            no_bedrooms,
            no_bathrooms,
            area_size,
            nearby_railwaystation,
            nearby_Hospital,
            description,
            image,
            user: req.user,
            userId: req.userId,
            like
        });

        await newPost.save();
        res.status(201).send(newPost);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


propertyRouter.get('/posts',auth ,async (req, res) => {
    try {
        const {userId}=req
        const posts = await PropertyModel.find({userId});
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



propertyRouter.get('/allposts', auth, async (req, res) => {
    try {
        let { place, housetype, page, limit } = req.query;

        if (housetype) housetype = housetype.toLowerCase();
        const filter = {};
        if (place) filter.place = new RegExp(place, 'i'); 
        if (housetype) filter.housetype = new RegExp(housetype, 'i'); 

        const pageNumber = parseInt(page) || 1;
        const pageSize = parseInt(limit) || 10;

        const posts = await PropertyModel.find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);
        
        const postsWithBase64Images = posts.map(post => ({
            ...post.toObject(),
            image: post.image.toString('base64')
        }));
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


propertyRouter.patch("/update/:postId",auth,async(req,res)=>{
    const {postId}=req.params
    const posts=await PropertyModel.findOne({_id:postId})
    try{
if(req.userId!==posts.userId){
    res.status(200).send({"msg":"You are not authorized Person"}) 
}else{
    await PropertyModel.findByIdAndUpdate({_id:postId},req.body)
    res.status(200).send({"msg":"Data Updated Successfully"})
}
    }catch(er){
        res.status(400).send({"msg":er.message})
    }
})


propertyRouter.delete("/delete/:postId",auth,async(req,res)=>{
    const {postId}=req.params
    const posts=await PropertyModel.findOne({_id:postId})
    try{
if(req.userId!=posts.userId){
    console.log(req.userId)
    res.status(200).send({"msg":"You are not authorized Person"}) 
}else{
    await PropertyModel.findByIdAndDelete({_id:postId},req.body)
    res.status(200).send({"msg":"Data Deleted Successfully"})
}
    }catch(er){
        res.status(400).send({"msg":er.message})
    }
})



propertyRouter.patch("/updatelike/:postId", async (req, res) => {
    const { postId } = req.params;
    try {
        const post = await PropertyModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { "like": 1 }, $set: req.body },
            { new: true }
        );

        if (!post) {
            return res.status(404).send({ msg: "Post not found" });
        }

        res.status(200).send({ msg: "Data Updated Successfully", post });
    } catch (err) {
        res.status(400).send({ msg: err.message });
    }
});


propertyRouter.get("/specroute/:id",async(req,res)=>{
    const {id}=req.params
    try{
        const property=await PropertyModel.findOne({_id:id})
        res.status(200).send({data:property})

    }catch(err){
        res.status(401).send({"Message":err.message})
    }
})

module.exports = {
    propertyRouter
};
