const errorController = {};

errorController.triggerIntentionalError = (req, res, next) => {
  // The intentional error middleware will be triggered here
  next();
};

module.exports = errorController;