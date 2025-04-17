const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/projectController');
const { ensureAuthenticated, ensureResearcher } = require('../middleware/authMiddleware');

// This is the Route to display the project creation form using GET
router.get('/create', ensureAuthenticated, ensureResearcher, (req, res) => {
  res.render('create'); // Make sure this EJS view exists
});

// This is the Route to handle the form submission using POST
router.post('/create', ensureAuthenticated, ensureResearcher, projectController.createProject);

// Show all projects for the logged-in researcher
router.get('/my-projects', ensureAuthenticated, ensureResearcher, projectController.getMyProjects);

// View a single project by ID
router.get('/:id', ensureAuthenticated, ensureResearcher, projectController.viewProjectDetails);

module.exports = router;
