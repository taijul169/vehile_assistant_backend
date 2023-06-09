
// const User =  require('../models/userModel')
const db =  require('../models')
const {StatusCodes} = require('http-status-codes')
const Group =  db.groups
// image upload
const multer  = require('multer')
const path =  require('path')
const Request = db.requsts
// register user functionality-------------------------------------
const register = async( req,res, next) =>{
    try {
        const {customer_phone, customer_long,customer_lat,service_type ,customer_name,customer_address} = req.body
        console.log("req.body",req.body)

        if(!customer_phone || !customer_lat || !customer_long ){
            res.status(StatusCodes.BAD_REQUEST).json({ 
                msg:"Please Provide all values",
                code:400
             })
        }else{
              const request =  await Request.create({customer_phone, customer_long,customer_lat,service_type,customer_name,customer_address})
              res.status(StatusCodes.CREATED).json({request,code:201,msg:'success'})
            }
            
    } catch (error) {
        console.log("error",error)
        res.status(StatusCodes.BAD_REQUEST).json({code:400,msg:'failed'})
    }
        
       
}

// get all request 
const getAllRequest = async (req,res)=>{
    try {
        const requests =  await Request.findAll({
            order:[['id','DESC'],]
        })
        res.status(StatusCodes.OK).json({requests,code:200,msg:'success'})
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({code:404,msg:'Failed'})
    }
}
// get all requests by status
const getAllrequestsBystatus =  async (req,res)=>{
    try {
        const requests =  await Request.findAll({where:{status:req.params.status}})
        res.status(StatusCodes.OK).json({requests,code:200,msg:'success'})
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({code:404,msg:'Failed'})
    }
}
// get all requests by status and group id
const getAllrequestsBystatusGROUPID =  async (req,res)=>{
    try {
        const requests =  await Request.findAll({where:{status:req.params.status,group_id:req.params.group_id}})
        res.status(StatusCodes.OK).json({requests,code:200,msg:'success'})
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({code:404,msg:'Failed'})
    }
}

const assignGroupToRequest =  async (req,res)=>{
    try {
        const assign = await Request.update({group_id:req.params.group_id,isviewed:true, isassigned:true,status:'Sentrequest'},{where:{id:req.params.id}})
        res.status(StatusCodes.OK).json({assign})
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST.json({error}))
    }

    
}

const acceptOrDeclineRequest =  async (req,res)=>{
    try {
        if(req.params.status == 'accept'){
            const assign = await Request.update({group_id:req.params.group_id,isviewed:true, isassigned:true,status:'Accepted'},{where:{id:req.params.id}})
            res.status(StatusCodes.OK).json({assign})
        }
        if(req.params.status == 'decline'){
            const assign = await Request.update({group_id:req.params.group_id,isviewed:true, isassigned:true,status:'Declined'},{where:{id:req.params.id}})
            res.status(StatusCodes.OK).json({assign})
        }
        
    } catch (error) {
        res.status(StatusCodes.BAD_REQUEST.json({error}))
    }

    
}


// get all requests by status and group id
const getallassignedRequestbyGROUPIDPending =  async (req,res)=>{
    try {
        const requests =  await Request.findAll({where:{isassigned:true,group_id:req.params.group_id,status:'Pending'}})
        res.status(StatusCodes.OK).json({requests,code:200,msg:'success'})
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({code:404,msg:'Failed'})
    }
}

// get all requests by status and group id
const getallassignedRequestbyGROUPID =  async (req,res)=>{
    try {
        const requests =  await Request.findAll({where:{isassigned:true,group_id:req.params.group_id}})
        res.status(StatusCodes.OK).json({requests,code:200,msg:'success'})
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({code:404,msg:'Failed'})
    }
}

// get single request by request id
const getsinglerquest =  async (req,res)=>{
    try {
        const request =  await Request.findOne({where:{id:req.params.id}})
        res.status(StatusCodes.OK).json({request,code:200,msg:'success'})
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({code:404,msg:'Failed'})
    }
}


const getsingleassignedRequest  = async (req,res)=>{
    try {
        const request =  await Request.findOne({where:{id:req.params.id},
            include:[
                {
                    model:Group,
                    as:'group',
                    required:false,
                    // attributes: {
                    //     include: [
                    //       [sequelize.fn('AVG', sequelize.col('review.rating')), 'rating']
                    //     ],
                    //   },
                },
            ]
        })

        res.status(StatusCodes.OK).json({request,code:200,msg:'success'})
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({code:404,msg:'Failed'})
    }
}





module.exports = { register,assignGroupToRequest,getAllrequestsBystatusGROUPID,getAllrequestsBystatus,getAllRequest,getallassignedRequestbyGROUPID,getsinglerquest,getsingleassignedRequest,acceptOrDeclineRequest,getallassignedRequestbyGROUPIDPending}