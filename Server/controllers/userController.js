const ApiError = require("../error/ApiError")
const { Client } = require('pg');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const generate_jwt = (user) =>{
    console.log('success')
    return jwt.sign({user} ,process.env.SECRET_KEY,{expiresIn:'24h'})

}
var client = new Client({
 user: process.env.db_user,
 host: process.env.db_host,
 database: process.env.db_name,
 password: 'ashot',
 port:process.env.db_port,
});

const {User} = require('../models/moddels')
const sequelize = require("../bd");

class userController
{
async registration(req,res, next)
{
    const boddy = req.body;
const {username,password} = req.body;

if(!username || !password)
{
    return next(ApiError.badRequest('Неверные данные при регистрации'));
}
const candidate = await User.findOne({where: {username}})
    if(candidate)
    {
        return next(ApiError.badRequest('Неверные данные при регистрации'));
    }
const hashPassword = await bcrypt.hash(password,5);

    client = new Client({
        user: process.env.db_user,
        host: process.env.db_host,
        database: process.env.db_name,
        password: process.env.db_password ,
        port:process.env.db_port,
    });
 client.connect();


var VALUES =[ username , hashPassword ];

 client.query(`insert into users (username,password) values  ($1,$2);`,
     VALUES,
     async (err, ress) => {

         if (err) {
             console.error(err);
             return res.status(401).json("Неверные данные при регистрации")
         } else {

             console.log(ress);

         }

         var userr = await User.findOne({where: {username}})

         const token = generate_jwt(userr)

         return res.status('201').json({token});
     });







}

async login(req,res)
{

try{
const boddy = req.body

   const {username,password} = boddy
    const user = await User.findOne({where:{username}})

    if(!user)
    {
        return res.status(400).json("Неверные данные при входе")
    }
    let compare_password = bcrypt.compareSync(password,user.password)
    if(!compare_password)
    {    return res.status(400).json("Неверные данные при входе")}

    console.log(user)
    var token = generate_jwt(user)
    console.log(token)

return  res.status(200).json({token})
}
catch(e){
    return res.status(400).json("Неверные данные при входе")}
}



}
module.exports = new userController()