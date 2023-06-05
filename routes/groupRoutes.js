
const  express = require('express')
const router =  express.Router()

// import rateLimiter from 'express-rate-limit'
// const  apiLimiter  = rateLimiter({
//     windowMS:15 *60*1000, // 15 minutes
//     max:10,
//     message:'Too many requests from this IP address,please try again after 15 minutes'
// })
const { register, login, updateUser,upload,getallgroups,getsingleGroup}  = require('../controllers/authGroupController') 
const  authenticateUser =  require('../middleware/auth') 

router.route('/register').post(upload,register);
router.route('/login').post(login);
router.route('/updateuser/:id').put(upload, updateUser);
router.route('/getallgroups').get(getallgroups)
router.route('/getsinglegroup/:id').get(getsingleGroup)
module.exports =  router

