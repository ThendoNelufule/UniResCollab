// tests/mocks/ensureResearcher.js
module.exports = (req, res, next) => {
    if (req.user && req.user.role === 'Researcher') {
        return next(); 
    }
    res.status(403).send('Forbidden'); 
};
