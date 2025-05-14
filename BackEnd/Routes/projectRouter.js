const express = require('express');
const router = express.Router();
const projectController = require('../Controllers/projectController');
const userController = require('../Controllers/userController');
const { ensureAuthenticated, ensureResearcher } = require('../middleware/authMiddleware');
const flash = require('express-flash');
const Project = require('../Models/project');
const User = require('../Models/userModel');



// Use flash after session setup
router.use(flash());


// Show form to create a project
router.get('/create', ensureAuthenticated,(req, res) => {
  res.render('create'); // View: views/create.ejs
});


// Handle project form submission
router.post('/create', ensureAuthenticated, projectController.createProject);

// Get all projects for logged-in researcher
router.get('/my-projects', ensureAuthenticated, projectController.getMyProjects);

// View a single project's details by ID
router.get('/project-details/:id', ensureAuthenticated, projectController.viewProjectDetails);

router.delete('/project-details/:id/delete',ensureAuthenticated, projectController.deleteProject);

router.post('/project-details/:id/edit', ensureAuthenticated, projectController.editProject);

router.get('/project-details/:id/edit', ensureAuthenticated, projectController.getEditProjectForm);

router.get('/project-details/:id/invite-collaborators', ensureAuthenticated, projectController.getInviteCollaboratorsForm);

router.get('/searchUser', projectController.searchUserByUsername);

router.post('/addCollaborator', ensureAuthenticated, projectController.addCollaborator);


router.get('/:projectId/collaborators', async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).send('Project not found');
    }

    // collaborators is just an array of strings
    res.render('collaborators', {
      collaborators: project.collaborators,
      project,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


router.post('/removeCollaborator', async (req, res) => {
  const { username, projectId } = req.body;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Remove collaborator if exists
    project.collaborators = project.collaborators.filter(u => u !== username);
    await project.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




router.get('/all', async (req, res) => {
  try {
    const projects = await Project.find({});
    res.render('all-projects', { projects });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// routes/admin.js (or wherever your route is)
router.post('/users/remove', async (req, res) => {
  const usernameToRemove = req.body.username;

  try {
    // Delete the user
    const user = await User.findOneAndDelete({ username: usernameToRemove });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Delete all projects owned by this user
    await Project.deleteMany({ user: user._id });

    res.json({ success: true, message: "User and their projects removed successfully." });
  } catch (err) {
    console.error('Error removing user and projects:', err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
});
module.exports = router;
