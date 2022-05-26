const sequelize = require ('../bd')
const DataTypes = require ('sequelize')

const User = sequelize.define('user',
{
id: {type: DataTypes.INTEGER, primaryKey:true, autoincrement:true },
    username:{ type: DataTypes.STRING,unique:true},
   password:{ type: DataTypes.STRING},

})
const Message = sequelize.define('messages',
{

    fromusername:{ type: DataTypes.STRING},
    date:{ type: DataTypes.BIGINT},
too:{ type: DataTypes.STRING},
   message:{ type: DataTypes.STRING},
    title:{ type: DataTypes.STRING},


})
User.hasMany(Message)
Message.belongsTo(User)

module.exports = {User,Message}