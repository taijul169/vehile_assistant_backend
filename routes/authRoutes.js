
const  express = require('express')
const router =  express.Router()

// import rateLimiter from 'express-rate-limit'
// const  apiLimiter  = rateLimiter({
//     windowMS:15 *60*1000, // 15 minutes
//     max:10,
//     message:'Too many requests from this IP address,please try again after 15 minutes'
// })
const { register, login, updateUser,upload,sendCode,verifyCode,getSingleUser,getAllcodes}  = require('../controllers/authController') 
const  authenticateUser =  require('../middleware/auth') 

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateuser/:id').put(upload, updateUser);
router.route('/getuser/:id').get( getSingleUser);


router.route('/sendcode').post(sendCode);
router.route('/verifycode').post(verifyCode);
router.route('/getallcodes').get(getAllcodes);
module.exports =  router

