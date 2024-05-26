const {UserModel}=require("../model/user.model")
const nodemailer = require("nodemailer");
const {auth}=require("../middlewares/user.middle")

const {Router}=require("express")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

const userRouter=Router()

userRouter.post("/register",async(req,res)=>{
    const {user,firstname,lastname,phoneno,email,password}=req.body
    
    try{
        const finduser=await UserModel.findOne({email})
        if(finduser){
            res.status(200).send({"msg":`User already Registered as ${finduser.user} Please Login`})
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                const users=UserModel({firstname,lastname,phoneno,user,email,password:hash})
                await users.save()
                res.status(200).send({"msg":`User Registered Successfully as ${user}`})
            })
        }
    }catch(error){
        res.status(401).send({"msg":error.message})
    }
})


userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        const finduser=await UserModel.findOne({email})
        if(finduser){
            bcrypt.compare(password, finduser.password,(err,result)=>{
                if(result){
                    const token=jwt.sign({user:finduser.firstname,userId:finduser._id},"presidio");
                   res.status(200).send({"msg":"Login Successfully","token":token,user:finduser })
                }else{
                    res.status(200).send({"msg":"Wrong Credential"}) 
                }
            })
        }else{
            res.status(200).send({"msg":"Wrong Credential"}) 
        }
    }catch(er){
        res.status(400).send({"msg":er.message}) 
    }
})





userRouter.get("/singleuser/:_id", auth, async (req, res) => {
    try {
      const { _id } = req.params;
      const user = await UserModel.findById(_id);
      const buyeruser = await UserModel.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (!buyeruser || !buyeruser.email) {
        return res.status(400).json({ message: "Invalid buyer user or email address" });
      }

      const buyerEmail = buyeruser.email;
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'elliott.howell73@ethereal.email',
          pass: 'bvWcSKCrSw16Tx6pst'
        }
      });
  

      const userText = JSON.stringify(user, null, 4);

      const info = await transporter.sendMail({
        from: '"Maddison Foo Koch 👻" <kolipyakasumit@gmail.com>',
        to: `${buyeruser.email}`,
        subject: "Hello ✔", 
        text: userText, 
        html: "<b>Hello world?</b>",
      });
    
  
      res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});




module.exports={
    userRouter
}