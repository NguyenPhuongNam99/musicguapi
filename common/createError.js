module.exports.createError = (status = 500, message = "Opps!!!") => {
  const error = new Error(message);
  error.status = status;
  return error;
};
