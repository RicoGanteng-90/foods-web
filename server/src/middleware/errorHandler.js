const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res
      .status(400)
      .json({ success: false, message: `Duplicate value for ${field} field` });
  }

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ success: false, message: messages.join(', ') });
  }

  if (err.name === 'CastError') {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid ID format' });
  }

  if (err.name === 'JsonWebTokenError') {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid token, authorization denied' });
  }

  if (err.name === 'UnauthorizedError') {
    return res
      .status(401)
      .json({ success: false, message: 'Unauthorized access' });
  }

  if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid JSON payload' });
  }

  if (err.name === 'MulterError') {
    return res
      .status(400)
      .json({ success: false, message: 'File upload error: ' + err.message });
  }

  if (err.name === 'TokenExpiredError') {
    return res
      .status(401)
      .json({ success: false, message: 'Token expired, please log in again' });
  }

  res
    .status(err.statusCode || 500)
    .json({ success: false, message: err.message || 'Internal Server Error' });
};

export default errorHandler;
