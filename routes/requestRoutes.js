
const  express = require('express')
const router =  express.Router()

// import rateLimiter from 'express-rate-limit'
// const  apiLimiter  = rateLimiter({
//     windowMS:15 *60*1000, // 15 minutes
//     max:10,
//     message:'Too many requests from this IP address,please try again after 15 minutes'
// })
const { register,assignGroupToRequest,getAllrequestsBystatusGROUPID,getAllrequestsBystatus,getAllRequest}  = require('../controllers/authRequestController') 
const  authenticateUser =  require('../middleware/auth') 

router.route('/register').post(register);
router.route('/getallrequests').get(getAllRequest);
router.route('/getallrequestbystatus/:status').get(getAllrequestsBystatus);
router.route('/getuserbystatusgroupid/:group_id/:status').get( getAllrequestsBystatusGROUPID);
router.route('/assigngrouptorequest').put(assignGroupToRequest);
module.exports =  router

