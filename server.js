const express = require("express");
const cors = require("cors");
const app =  express();
const dotenv =  require("dotenv") 
const bodyParser =  require('body-parser')
dotenv.config() 
var corOptions ={
    origin:"http://localhost:5050"
}



// middleware
app.use(cors(corOptions))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(bodyParser.urlencoded({
    extended: true
  }));
const authantication = require('./middleware/auth.js')
// routers

const authrouter = require('./routes/authRoutes.js')

const authadmin = require('./routes/authadminRoutes.js')
const authgroup = require('./routes/groupRoutes.js')


app.use('/api/auth',authrouter)
app.use('/api/admin',authadmin)
app.use('/api/group',authgroup)


// static image folder
app.use('/Images',express.static('./Images'))
// testing api
app.get("/",(req,res)=>{
    res.json({message:"hello from api" })
})

// port

const PORT =  process.env.PORT || 5000


// server

app.listen(PORT,()=>{
    console.log(`server is runnig at port:${PORT}`)
})
