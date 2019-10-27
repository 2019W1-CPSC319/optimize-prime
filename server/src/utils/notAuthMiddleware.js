module.exports = (req, res, next) => {
  if (!req.user || !req.isAuthenticated()) {
    return res.status(400).send('Unauthorized');
  }
  next();
};
