function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

function ensureAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        return next();
    }
    res.redirect('/restricted');
}

function isBanned(req, res, next) {
    if (req.isAuthenticated() && req.user.status === 'banned') {
      res.redirect('/banned');
    }
    else if (req.isAuthenticated() && req.user.status === 'suspended') {
      res.redirect('/suspended');
    }
    return next();
}
  
module.exports = { ensureAuthenticated, ensureAdmin, isBanned };
  