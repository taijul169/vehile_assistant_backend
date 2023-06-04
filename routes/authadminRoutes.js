
const  express = require('express')
const router =  express.Router()

// import rateLimiter from 'express-rate-limit'
// const  apiLimiter  = rateLimiter({
//     windowMS:15 *60*1000, // 15 minutes
//     max:10,
//     message:'Too many requests from this IP address,please try again after 15 minutes'
// })
const { register, login,updateadmin,authenticateAdmin,upload}  = require('../controllers/authAdminController') 
const  authenticateUser =  require('../middleware/auth') 

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/updateUser/:id').put(upload,updateadmin);
router.route('/adminauthenticate').post(authenticateAdmin);
module.exports =  router

