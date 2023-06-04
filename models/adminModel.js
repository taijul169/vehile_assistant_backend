const jwt  =  require('jsonwebtoken')

module.exports =  (sequalize, DataTypes) =>{
    const Admin = sequalize.define('admin',{
        firstname:{
            type:DataTypes.STRING,
            allowNull:true
        },
        lastname:{
            type:DataTypes.STRING,
            allowNull:true
        },
        email:{
            type:DataTypes.STRING,
            allowNull:false
        },
        gender:{
            type: DataTypes.STRING,
            allowNull:true
        },
        dateofbirth:{
            type:DataTypes.STRING,
            allowNull:true
        },
        address:{
            type:DataTypes.STRING,
            allowNull:true
        },
        phone:{
            type:DataTypes.STRING,
            allowNull:true
        },
        active:{
            type:DataTypes.BOOLEAN,
            defaultValue: 1,
        },
        image:{
            type:DataTypes.STRING,
            allowNull:true
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false
        },
        role:{
            type:DataTypes.STRING,
            defaultValue:'SUPER_ADMIN',
        },
        jwtoken:{
            type:DataTypes.TEXT
        },
        firebasetoken:{
            type:DataTypes.TEXT,
            defaultValue:null
        }



    })
    if(Admin){
        Admin.prototype.createJWT = function (){
            return jwt.sign({userId:this.id },process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
        }
    }
    return Admin;
    
}


