const jwt  =  require('jsonwebtoken')

module.exports =  (sequalize, DataTypes) =>{
    const User = sequalize.define('user',{
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
        }


    })
    if(User){
        User.prototype.createJWT = function (){
            return jwt.sign({userId:this.id },process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
        }
    }
    return User;
    
}


