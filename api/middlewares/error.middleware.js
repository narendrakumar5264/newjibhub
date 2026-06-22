export const errorHandler = (err, req, res, next) => {
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message =
      field === 'email'
        ? 'An account with this email already exists.'
        : field === 'username'
        ? 'This username is already taken. Please choose another.'
        : 'Duplicate value error. Please use a different value.';
    return res.status(409).json({ success: false, message, statusCode: 409 });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({ success: false, message, statusCode });
};
