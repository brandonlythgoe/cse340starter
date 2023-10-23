const intentionalErrorMiddleware = (req, res, next) => {
    // Simulate an intentional error by throwing an exception
    throw new Error('Intentional 500-type error');
  };
  
  module.exports = intentionalErrorMiddleware;