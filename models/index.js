const dbConfig =  require('../config/dbConfig.js');
const {Sequelize,DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host:dbConfig.HOST,
        dialect:dbConfig.dialect,
        operatorsAliases:false,

        pool:{
            max:dbConfig.pool.max,
            min:dbConfig.pool.min,
            acquire:dbConfig.pool.acquire,
            idle:dbConfig.pool.idle
        }
    }
)



sequelize.authenticate()
.then(()=>{
    console.log("connected")
})
.catch(err =>{
    console.log('Error',err)
})


const db = {

}

db.Sequelize = Sequelize;
db.sequelize =  sequelize



db.users = require('./userModel.js')(sequelize,DataTypes)
db.admins = require('./adminModel.js')(sequelize,DataTypes)
db.groups = require('./groupModel.js')(sequelize,DataTypes)
db.requsts = require('./requestModel')(sequelize,DataTypes)
db.sequelize.sync({
    force:false
})
.then(()=>{
    console.log("yes re-sync done!")
})

// one to one relationship between shipping address and order

// one to many relationship between request and group
db.groups.hasMany(db.requsts,{
    foreignKey:'group_id',
    as:'request'
})

db.requsts.belongsTo(db.groups,{
    foreignKey:'group_id',
    as:'group'
})

// 1 to many Relation

// db.products.hasMany(db.reviews,{
//     foreignKey:'product_id',
//     as:'review'
// })

// db.reviews.belongsTo(db.products,
//     {
//         foreignKey:'product_id',
//         as:'product'
//     })

// // 1 to many relation between orders and users
// db.users.hasMany(db.orders,{
//     foreignKey:'user_id',
//     as:'order'

// })

// db.orders.belongsTo(db.users,{
//     foreignKey:'user_id',
//     as:'user'
// })


// // one to many relation between orders and orderitems
// db.orders.hasMany(db.orderitems,{
//     foreignKey:'order_id',
//     as:'orderitem'
// })

// db.orderitems.belongsTo(db.orders,{
//     foreignKey:'order_id',
//     as:'order'
// })

// // one to many relation between product and image
// db.products.hasMany(db.productimages,{
//     foreignKey:'product_id',
//     as:'productimage'
// })

// db.productimages.belongsTo(db.products,
//     {
//         foreignKey:'product_id',
//         as:'product'
//     })
// // payment and order relationship
// // db.orders.hasMany(db.paymentdetails,{
// //     foreignKey:'order_id',
// //     as:'paymentdetails'
// // })

// // db.paymentdetails.belongsTo(db.orders,{
// //     foreignKey:'order_id',
// //     as:'order'
// // })

// // one to many relation between product and discount
// db.discounts.hasMany(db.discountitems,{
//     foreignKey:'discount_id',
//     as:'discountitem'
// })

// db.discountitems.belongsTo(db.discounts,
//     {
//         foreignKey:'discount_id',
//         as:'discount'
//  })

// //  one to many relationship between discountitem and products
//  db.discountitems.belongsTo(db.products,{
//     foreignKey:'product_id',
//     as:'product'
// })

// db.products.hasMany(db.discountitems,
//     {
//         foreignKey:'product_id',
//         as:'discountitem'
//  })



module.exports = db