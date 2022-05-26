const {Message} = require('../models/moddels')
const {User} = require('../models/moddels')
const ApiError=require('../error/ApiError')
const {Client} = require("pg");
const { Op } = require("sequelize");
const jwtDecode = require("jwt-decode");
const jwt = require("jsonwebtoken");

var client = new Client({
 user: process.env.db_user,
 host: process.env.db_host,
 database: process.env.db_name,
 password: process.env.db_password,
 port:process.env.db_port,
});
class MessageController {

 async getmy(req, res) {
  var token;
  var mess;
  token =  req.query.token || req.headers["x-access-token"] || req.headers["Postman-token"] || req.headers["tokentrs"]
  if(!token)
  {
   return   res.status('401').json({message:"Не авторизован"})
  }
 else{

   var s = jwtDecode(req.body.token || req.query.token || req.headers["x-access-token"]|| req.headers["tokent"]).user
   var {username} = s
      if(s){
   var frommm = username
      console.log(frommm)
      var {date} = req.query
   if(!date) {
    mess = await Message.findAll({where: {too: frommm.toString() + ""},attributes:['id','fromusername','title','message']})
       return res.json(mess)
   }
   else
   {
    var datee= Date.parse(date)

    mess = await Message.findAll({where: {too: frommm.toString() + "",date:{[Op.gte]: datee}}, attributes:['id','fromusername','title','message']})
       return res.status(200).json(mess)
   }}
      else
      {res.status('401').json({message:"Не авторизован"})}


  }


 }

 async getmecount(req, res) {
  var token;

  token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["token"]
  if(token)
  {

  var count
  var s = jwtDecode(req.body.token || req.query.token || req.headers["x-access-token"]).user
      if(!s){   return res.status('401').json({description:"Не аутентифицирован"})}
  var {username} = s
  var frommm = username
  var {date} = req.query
  if (!date){
   count = await Message.count({where: {too: frommm.toString() + ""}})

  }
  else {
      var time =Date.parse(date)
   count = await  Message.count({where: {too: frommm.toString() + "", date: {[Op.gte]: time}}})
   console.log(count)
  }
   return res.status(200).json({count})
 }
  else{
      return res.status('401').json({description:"Не аутентифицирован"})
  }
 }

 async createmessage(req,res) {
     try {
         var flag = false
         client = new Client({
             user: process.env.db_user,
             host: process.env.db_host,
             database: process.env.db_name,
             password: process.env.db_password,
             port: process.env.db_port,
         });
         client.connect();


         var token;

         token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["token"]
         if (token) {

             var count
             var s = jwtDecode(req.body.token || req.query.token || req.headers["x-access-token"]).user
             if (!s) {
                 return res.status('404').json({description: "Не аутентифицирован"})
             }


             const boddy = req.body;


             var time = Date.parse(Date.now())

             var userrr = boddy.to
             if ((!userrr) || !boddy.message || !boddy.to || !boddy.title ) {
                 return res.status(404).json({description: "Получатель не найден"})
             } else {
                 var rerciever = await User.findOne({where: {username: {[Op.eq]: userrr}}});
                 if (!rerciever)
                     return res.status(404).json({description: "Получатель не найден"})
                 else {
                     var VALUES = [s.username, time + 0, boddy.to, boddy.title, boddy.message];

               var a= await client.query(`insert into messages (fromUsername,date,too,title,message) values  ($1,$2,$3,$4,$5);`, VALUES, (err, ress) => {

                         if (err) {
                             console.error(err);
                             res.status(404).json("Получатель не найден")
                         } else
                         {
                             flag = true

                             res.status(201).json("Успешная отправка сообщения")}

                     });

return res

                 }
             }
         } else
             return res.status('404').json({description: "Не авторизован"})



 }
 catch(e){
     return res.status('404').json({description: "Ошибка"})
 }}
 }
module.exports = new MessageController()