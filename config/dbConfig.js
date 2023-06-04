module.exports ={
    HOST:'localhost',
    USER:"root",
    PASSWORD:"rootpassword",
    DB:"vehicle_assistant",
    dialect:'mysql',

    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }


}