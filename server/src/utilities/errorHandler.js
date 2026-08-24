const errorHandler = (err, req, res, next) => {
  console.error('Express Error Handler:', err.stack || err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Do not leak stack trace in production
  const response = {
    error: message
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
