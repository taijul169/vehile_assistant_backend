
// const User =  require('../models/userModel')
const db =  require('../models')
const {StatusCodes} = require('http-status-codes')
const User =db.users
const Code = db.codes
const Group =  db.groups
// image upload
const multer  = require('multer')
const path =  require('path')

// register user functionality-------------------------------------
const register = async( req,res, next) =>{
    try {
        const {firstname, email, password,lastname,phone,gender,dateofbirth,address,lat,long } = req.body
        console.log("req.body",req.body)

        if(!firstname || !phone || !password ){
            res.status(StatusCodes.BAD_REQUEST).json({ 
                msg:"Please Provide all values",
                code:400
             })
        }else{
            const userAlreadyExists  = await Group.findOne({where:{phone:phone}})
            if(userAlreadyExists){
                res.status(409).json({ 
                msg:"User already exist!!",code:409 
                })
            }else{
                if(req.file){
                    const group =  await Group.create({firstname,phone,gender,address,lat,long,dateofbirth,password,email,lastname,image:req.file.path})
                    const token =   group.createJWT()
                    res.status(StatusCodes.CREATED).json({group,token,code:201,msg:'success'})
                }else{
                    const group =  await Group.create({firstname,phone,gender,address,lat,long,dateofbirth,password,email,lastname})
                    const token =   group.createJWT()
                    res.status(StatusCodes.CREATED).json({group,token,code:201,msg:'success'})
                }
                

                
                }
            }
            
         
        // if(phone.length !=11){
        //     res.status(StatusCodes.BAD_REQUEST).json({ 
        //         msg:"Invalid Phone Number"
        //      })
        // }
    } catch (error) {
        console.log("error",error)
        res.status(StatusCodes.BAD_REQUEST).json({code:400,msg:'failed'})
    }
        
       
}


// loging functionality--------------------------------------------
const login = async( req,res) =>{
    try {
        const {phone,password }  = req.body;
        if(!phone || !password){
            res.status(400).json({ 
                msg:"Please Provide all values",
                code:400
          })
        }else{
            const user  = await Group.findOne({where:{phone,password}})
            if(!user){
                res.status(StatusCodes.UNAUTHORIZED).json({ 
                    msg:"Invalid Credentials",
                    code:401
              })
              
            }else{
               // const isPasswordCorrect  =  await user.comparePassword(password)
            // if(!isPasswordCorrect){
            //     throw new UnAuthenticatedError('Invalid Credentials')
            // }
                const token = user.createJWT()
                user.password = undefined
                res.status(StatusCodes.OK).json({user,token,code:200})
            }
            
        }
       
    } catch (error) {
        res.send({error})
    }
   
}


// update user functionality----------------------------------------------
const updateUser = async( req,res) =>{
    try {
        let id = req.params.id
        if(!req.body.firstname  || !req.body.lat || !req.body.long || !req.body.phone){
            res.status(StatusCodes.BAD_REQUEST).json({ 
                msg:"Please Provide all values"
             })
        }else{
            if(req.file){
                let info ={
                    image:req.file.path,
                    firstname:req.body.firstname,
                    lastname:req.body.lastname,
                    phone:req.body.phone,
                    gender:req.body.gender,
                    address:req.body.address,
                    email:req.body.email,
                    dateofbirth:req.body.dateofbirth,
                    lat:req.body.lat,
                    long:req.body.long,
                    password:req.body.password
                }
                const user = await User.update(info,{where:{id:id}})
                res.status(200).send({user,code:200,msg:'success'})
                console.log(user)
                
            }else{
                const user = await User.update(req.body,{where:{id:id}})
                res.status(200).send({user,code:200,msg:'success'})
                console.log(user)
            }
        }
       
    } catch (error) {
        console.log("error",error)
        res.status(400).send({error,code:400,msg:'failed'})
    }

   
}


// Upload image controller

const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        if(file){
            cb(null,'Images')
        }
        
    },
    filename:(req,file,cb)=>{
        if(file){
            cb(null,Date.now() + path.extname(file.originalname))
        }
        
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: '1000000' },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|webp/
        const mimeType = fileTypes.test(file.mimetype)  
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
}).single('image')


// const send code
const sendCode  = async (req,res)=>{
    try {
        const sec_code = await Code.create({
            phone:req.body.phone,
            name:req.body.firstname
        })
        res.status(StatusCodes.CREATED).json({sec_code,code:201,msg:'success'})
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST).json({code:400,msg:'failed'})
    }
 
}

// verify code
const verifyCode = async (req,res)=>{
  try {
      const exist = await Code.findOne({where:{phone:req.body.phone,code:req.body.code}})
      console.log("exist:",exist)
      if(!exist){
        res.status(StatusCodes.BAD_REQUEST).json({code:400,msg:'failed'})
      }else{
        const updatedData =  await Code.update({
            status:'Verified'
        },{where:{id:exist.id}})  
        res.status(StatusCodes.OK).json({code:200,msg:'success'})
        
      }
  } catch (error) {
      console.log("error",error)
      res.status(StatusCodes.BAD_REQUEST).json({code:400,msg:'failed'})
  }
}

const getSingleUser = async(req,res)=>{
  const user =  await User.findOne({where:{id:req.params.id}})
  user.image = `${req.protocol+"://"+req.headers.host}/${user.image}`
  res.status(StatusCodes.OK).json(user)
}

// get all codes

const getAllcodes =  async(req,res)=>{
    const codes = await Code.findAll({
        order: [
            ['id', 'DESC'],
           
        ],
    })

    res.status(StatusCodes.OK).json(codes)
}
module.exports = { register, login, updateUser,upload,sendCode,verifyCode,getSingleUser,getAllcodes}