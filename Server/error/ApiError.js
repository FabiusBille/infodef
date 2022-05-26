class ApiError extends Error{
constructor(status,message){
super();
this.status=status
this.message=message
}
static badRequest(message)
{return new ApiError(401,message)}
static internal(message)
{return new ApiError(400,message)}
static undef(message)
{return new ApiError(404,message)}

}
module.exports=ApiError