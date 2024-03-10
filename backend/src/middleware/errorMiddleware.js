import {StatusCodes} from 'http-status-codes'
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(StatusCodes.NOT_FOUND);
    next(error);
}
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === StatusCodes.OK ? StatusCodes.INTERNAL_SERVER_ERROR : res.statusCode;
    let message = err.message;
    if(err.name === 'CastError' && err.kind === 'ObjectId') {
        statusCode = StatusCodes.NOT_FOUND;
        message = 'Resource not found';
    }
    res.status(statusCode).json({
        message:message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
}
export {
    notFound,
    errorHandler
};