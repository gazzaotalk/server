const errorHandler = (err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({
    error: err,
    message: err.message || 'Unexpected error occured',
  });
};

module.exports = errorHandler;
