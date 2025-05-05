
// This function checks if the user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }

//This function checks if the user is a researcher
  function ensureResearcher(req, res, next) {
    if (req.user && req.user.role === 'Researcher') {
      return next();
    }
    res.status(403).send('Access denied. Researcher role required.');
  }
  
  
  module.exports = { ensureAuthenticated, ensureResearcher };
  