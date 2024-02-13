export const errorHandler=(statusCoode, message)=>{
    const error=new Error();
    error.statusCode=statusCoode;
    error.message=message;
    return error;
}