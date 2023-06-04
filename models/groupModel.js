const jwt  =  require('jsonwebtoken')

module.exports =  (sequalize, DataTypes) =>{
    const Group = sequalize.define('group',{
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
            allowNull:true,
            defaultValue:null
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
        lat:{
            type:DataTypes.STRING,
        },
        long:{
            type:DataTypes.STRING,
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
        jwtoken:{
            type:DataTypes.TEXT
        },
        firebasetoken:{
            type:DataTypes.TEXT,
            defaultValue:null
        }



    })
    if(Group){
        Group.prototype.createJWT = function (){
            return jwt.sign({userId:this.id },process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
        }
    }
    return Group;
    
}


