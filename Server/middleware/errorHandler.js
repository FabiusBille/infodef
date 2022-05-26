const ApiError = require('../error/ApiError')
module.exports = function(error,req,res,next)
{
if(error instanceof ApiError )
{
return res.status(error.status).json({description:error.message})
}
return res.status(205).json({description:'неизвестная ошибка'})
}