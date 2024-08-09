require('dotenv').config();

module.exports = function (req, res, next) {
  const { adminPassword } = req.body;

  if (adminPassword === process.env.SYS_ADMIN_PASS) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized: Incorrect admin password' });
  }
};