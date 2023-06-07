const multer = require("multer");
// const User =  require('../models/userModel')
const db =  require('../models')
const {StatusCodes} = require('http-status-codes')
const Admin =db.admins


// upload image controller
const storage =  multer.diskStorage({
 
    destination:function(req,file,cb){
        if(file){
            cb(null,'Images');
        }   
    },
    filename: function(req,file,cb){
        if(file){
            cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
        }
        
    }
})

const upload  =  multer({
    storage:storage,
    limits:{fileSize:'1000000'}
}).single('image')


// register Admin functionality-------------------------------------
const register = async( req,res, next) =>{
        const {firstname, email, password,lastname,phone,gender,dateofbirth,address } = req.body

        if(!firstname || !email  || !password){
            res.status(StatusCodes.BAD_REQUEST).json({ 
                msg:"Please Provide all values",
                code:409
             })
        }else{
            const userAlreadyExists  = await Admin.findOne({where:{email:email}})
            if(userAlreadyExists){
                res.status(StatusCodes.BAD_REQUEST).json({ 
                   msg:"User already exist!!",
                   code:400
                })
            }else{
                const admin =  await  Admin.create({firstname, email, password,lastname,phone,gender,dateofbirth,address })
    
                const token =   admin.createJWT()
                res.status(StatusCodes.CREATED).json({admin,token})
            }
            
        }
        
       
}


// loging functionality--------------------------------------------
const login = async( req,res) =>{
    try {
        const {email,password }  = req.body;
        console.log("req body:",req.body)
        if(!email || !password){
            res.status(StatusCodes.BAD_REQUEST).json({ 
                msg:"Please Provide all values",
                code:400
          })
        }else{
            const admin  = await Admin.findOne({where:{email,password}})
            if(!admin){
                res.status(StatusCodes.BAD_REQUEST).json({ 
                    msg:"Invalid Credentials",
                    code:401
              })
              
            }else{
                const token = admin.createJWT()
                const tokenset =  await Admin.update({jwtoken :token},{where:{id:admin.id}})
                admin.jwtoken = token
                admin.password = undefined
                res.status(StatusCodes.OK).json({admin,token,code:200})
            }
        }
       
        // const isPasswordCorrect  =  await admin.comparePassword(password)
        // if(!isPasswordCorrect){
        //     throw new UnAuthenticatedError('Invalid Credentials')
        // }

       
    } catch (error) {
        res.send(error)
        console.log("error",error)
    }
 
}


// update user functionality----------------------------------------------
//4 single Shop update
const updateadmin = async (req,res) =>{
    try {
        let id = req.params.id;
        if(req.file){
         console.log("req.file",req.file)
         const admin = await Admin.update(
             {
                 firstname:req.body.firstname,
                 lastname:req.body.lastname,
                 phone:req.body.phone,
                 address:req.body.address,
                 email:req.body.email,
                 gender:req.body.gender,
                 dateofbirth:req.body.dateofbirth,
                 role:req.body.role,
                 password:req.body.password,
                 image:req.file.path
             },{where:{id:id}})
            res.status(200).send(admin)
            console.log(admin)
     }
     else{
     
     const admin = await Admin.update({
                 firstname:req.body.firstname,
                 lastname:req.body.lastname,
                 phone:req.body.phone,
                 address:req.body.address,
                 email:req.body.email,
                 gender:req.body.gender,
                 dateofbirth:req.body.dateofbirth,
                 role:req.body.role,
                 password:req.body.password
         },{where:{id:id}})
         res.status(200).send(admin)
         console.log("admin",admin)
       }
    } catch (error) {
        console.log("error",error)
    }

    
}

const authenticateAdmin =  async (req,res)=>{
    try {
        console.log("token",req.query.token)
        const AdminData =  await Admin.findOne({where: {jwtoken:`${req.query.token}`}})
        if(AdminData){
            AdminData.image = `${req.protocol+"://"+req.headers.host}/${AdminData.image}`
            res.status(200).send({AdminData,code:200,msg:'success'})
        }else{
            res.status(404).send({msg:'Data not found!!',code:404})
        }
        
    } catch (error) {
        console.log(error)
        res.status(404).send({error})
    }
   
}
module.exports = { register, login, updateadmin,authenticateAdmin ,upload}