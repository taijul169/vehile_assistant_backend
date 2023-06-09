
// const User =  require('../models/userModel')
const db =  require('../models')
const {StatusCodes} = require('http-status-codes')
const User =db.users
const Code = db.codes
const Group =  db.groups
const Request =  db.requsts
// image upload
const multer  = require('multer')
const path =  require('path')


// register user functionality-------------------------------------
const register = async( req,res, next) =>{
    try {
        const {firstname, email, password,lastname,phone,gender,dateofbirth,address,lat,long } = req.body
        console.log("req.body",req.body)

        if(!firstname || !phone || !password || !email ){
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
                const token = user.createJWT()
                const tokenset =  await Group.update({jwtoken :token},{where:{id:user.id}})
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


// get all groups for admin panel
const getallgroupsbyrequest= async (req,res)=>{
    const customer_lat = req.query.lat
    const customer_lng = req.query.lng
    const requestID = req.query.id
    // let location={
    //     lat:23.802490764266548,
    //     lon:90.39176398501331
    // }
    // get availble group and their location

    //------------------------------ distance finding function start-----------------------
      function calculateDistance(lat1,lon1, lat2, lon2) {
        const earthRadius = 6371; // Radius of the Earth in kilometers
      
        // Convert latitude and longitude from degrees to radians
        const lat1Rad = toRadians(lat1);
        const lon1Rad = toRadians(lon1);
        const lat2Rad = toRadians(lat2);
        const lon2Rad = toRadians(lon2);
      
        // Haversine formula
        const deltaLat = lat2Rad - lat1Rad;
        const deltaLon = lon2Rad - lon1Rad;
        const a =
          Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
          Math.cos(lat1Rad) * Math.cos(lat2Rad) *
          Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadius * c;
      
        return distance;
      }
      
      function toRadians(degrees) {
        return degrees * (Math.PI / 180);
      }
      
     
       //------------------------------ distance finding function end-----------------------  
       if(!customer_lat || !customer_lng){
        res.status(StatusCodes.BAD_REQUEST).json({code:400,msg:'failed!! Customer location Required'})
       }else{
        const groups =  await Group.findAll({where:{active:true,currentstatus:'available'}})
    
        groups.map((item)=>{
            
            item.distance  = calculateDistance(customer_lat,customer_lng,item.lat,item.long).toFixed(2) 
        })
        let request;
        if(requestID){
            const a = await Request.findOne({where:{id:requestID}})
            request= a
        }
       
       // console.log("groups",groups)
        res.status(StatusCodes.OK).json({groups,request,code:200,msg:'success'})
       }
    
}



const getsingleGroup =  async (req,res)=>{
    const group =  await Group.findOne({where:{id:req.params.id}})
    res.status(StatusCodes.OK).json({group,code:200,msg:'success'})
}


const getallgroups =  async (req,res)=>{
    const groups =  await Group.findAll()
    res.status(StatusCodes.OK).json({groups,code:200,msg:'success'})
}


const authenticateGroup =  async (req,res)=>{
    try {
        console.log("token",req.query.token)
        const GroupData =  await Group.findOne({where: {jwtoken:`${req.query.token}`}})
        if(GroupData){
            GroupData.image = `${req.protocol+"://"+req.headers.host}/${GroupData.image}`
            res.status(200).send({GroupData,code:200,msg:'success'})
        }else{
            res.status(404).send({msg:'Data not found!!',code:404})
        }
        
    } catch (error) {
        console.log(error)
        res.status(404).send({error})
    }
   
}
module.exports = { register, login, updateUser,upload,getallgroupsbyrequest,getsingleGroup,getallgroups,authenticateGroup}