

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${day}-${month}-${year}`;
//console.log(currentDate); // "17-6-2022"
// current time

var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

// 6digit random number generate
const sec_code =Math.floor(100000 + Math.random() * 900000)
module.exports =  (sequalize, DataTypes) =>{
    const Request = sequalize.define('request',{
        customer_phone:{
            type:DataTypes.STRING,
            allowNull:false
        },
        customer_name:{
            type:DataTypes.STRING,
            
        },
        customer_address:{
            type:DataTypes.STRING,
        },
        customer_lat:{
            type:DataTypes.STRING,
        },
        customer_long:{
            type:DataTypes.STRING,
        },
        group_id:{
            type:DataTypes.INTEGER,
            defaultValue:null
        },
        status:{
            type:DataTypes.STRING,
            defaultValue: 'Pending',
        },
        service_type:{
            type:DataTypes.STRING,
        },
        createdDate:{
            type:DataTypes.STRING,
            defaultValue:currentDate
        },
        createdTime:{
            type:DataTypes.STRING,
            defaultValue:time
        },
        isviewed:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        },
        isassigned:{
            type:DataTypes.BOOLEAN,
            defaultValue:false
        }
    })
    
    return Request;
    
}


