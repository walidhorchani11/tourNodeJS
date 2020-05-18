class AppError extends Error {
  constructor(message, codeStatus) {
    super(message);
    this.codeStatus = codeStatus;
    this.status = `${codeStatus}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
