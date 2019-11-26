module.exports = (req, res, next) => {
  if (!req.user || !req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }
  next();
};
