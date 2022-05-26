require('dotenv').config()
const express = require("express")
const sequelize = require('./bd')
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('../Server/key.pem'),
    cert: fs.readFileSync('../Server/cert.pem')
};

const errorHandler = require('./middleware/errorHandler')
const port = process.env.port || 8080
var cors = require("cors")
const modules = require('./models/moddels')
const app = express()
app.use(cors())
app.use(express.json())

const userController = require('./controllers/userController')
const authMiddleware = require('./middleware/authMiddleware')
const AdwertController= require('./controllers/messageController')
app.post('/register',userController.registration)
app.post('/login',userController.login)
app.get('/get_messages',authMiddleware,AdwertController.getmy)
app.get('/get_message_count',authMiddleware,AdwertController.getmecount)
app.post('/post_message',authMiddleware,AdwertController.createmessage)
app.options = options
app.use(errorHandler)

const start = async() =>  {

    try
    {
        console.log('all ok')
        await sequelize.authenticate()

        await sequelize.sync()
        https.createServer(options, app).listen(8080);

        console.log('all ok')
    }
    catch (e)
    {
        console.log(e)
        console.log('sorry')
    }
}
start()