class ApiError extends Error {
    constructor(statusCode, message, data = null, errors = [], stack = '') {
        super(message); 
        this.statusCode = statusCode;
        this.data = data;
        this.errors = errors;
        this.message = message;
        
        if (stack) {
            this.stack = stack; 
            Error.captureStackTrace(this, this.constructor); 
        }
    }
}

export { ApiError };
