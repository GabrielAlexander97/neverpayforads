const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let statusCode = 500;
    let message = 'Internal Server Error';

    // Handle specific error types
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = err.message;
    } else if (err.name === 'UnauthorizedError') {
        statusCode = 401;
        message = 'Unauthorized';
    } else if (err.message.includes('not found')) {
        statusCode = 404;
        message = 'Resource not found';
    } else if (err.message) {
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
        path: req.path
    });
};

module.exports = errorHandler;
