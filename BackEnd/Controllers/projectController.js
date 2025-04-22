const Project = require('../Models/project');
const User = require('../Models/userModel'); 

// This is the function to create project API
exports.createProject = async (req, res) => {
  try {
    const {
      title,
      domain,
      abstract,
      startDate,
      endDate,
      methodology,
      pi,
      institution,
      visibility,
      ethics,
      dataPolicy,
      collaborators
    } = req.body;

    // Validate required fields
    if (!title || !domain || !abstract || !startDate || !endDate || !pi || !institution || !visibility) {
      return res.status(400).send('All required fields must be filled.');
    }

    const newProject = new Project({
      title,
      domain,
      abstract,
      startDate,
      endDate,
      methodology: Array.isArray(methodology) ? methodology : [methodology],
      pi,
      institution,
      visibility,
      ethics,
      dataPolicy,
      collaborators: Array.isArray(collaborators) ? collaborators : collaborators ? collaborators.split(',').map(c => c.trim()) : [],
      user: req.user._id  // Make sure you have this set from your session/login
    });

    await newProject.save();
    res.redirect('/researcher/Home');
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).send('Error creating project');
  }
};



// Get all projects for logged-in researcher
exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.render('my-projects', { projects });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving your projects');
  }
};

// View project details
exports.viewProjectDetails = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    const isOwner = project.user.toString() === req.user._id.toString();
    const isReviewer = req.user.role === 'Reviewer';
    const isCollaborator = project.collaborators?.includes(req.user.username);

    if (!isOwner && !isReviewer && !isCollaborator) {
      return res.status(403).send('You are not authorized to view this project');
    }

    res.render('project-details', { project, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving project details');
  }
};


// ResearcherHome: Fetch all projects for the logged-in researcher
exports.ResearcherHome = async (req, res) => {
  try {
    // Fetch all projects for the logged-in researcher
    const projects = await Project.find({ user: req.user._id });

    // Pass projects to the view
    res.render('ResearcherHome', { projects: projects || [] });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).send('Error retrieving your projects');
  }
};


// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Check if the logged-in user owns the project
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).send('Unauthorized to delete this project');
    }

    await Project.findByIdAndDelete(req.params.id);

    res.redirect('/researcher/Home'); // Or wherever you want to redirect after deletion
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).send('Error deleting project');
  }
};

// Edit/Update a project
exports.editProject = async (req, res) => {
  try {
    const projectId = req.params.id;

    const {
      title,
      domain,
      abstract,
      startDate,
      endDate,
      methodology,
      pi,
      institution,
      visibility,
      ethics,
      dataPolicy,
      collaborators
    } = req.body;

    // Find the project
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).send('Project not found');
    }

    // Check if the logged-in user owns the project
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).send('Unauthorized to edit this project');
    }

    // Update fields
    project.title = title || project.title;
    project.domain = domain || project.domain;
    project.abstract = abstract || project.abstract;
    project.startDate = startDate || project.startDate;
    project.endDate = endDate || project.endDate;
    project.methodology = Array.isArray(methodology) ? methodology : [methodology];
    project.pi = pi || project.pi;
    project.institution = institution || project.institution;
    project.visibility = visibility || project.visibility;
    project.ethics = ethics || project.ethics;
    project.dataPolicy = dataPolicy || project.dataPolicy;
    project.collaborators = Array.isArray(collaborators)
      ? collaborators
      : collaborators
      ? collaborators.split(',').map(c => c.trim())
      : project.collaborators;

    await project.save();

    res.redirect('/researcher/Home'); // Or redirect to the edited project page
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).send('Error updating project');
  }
};

// GET route to render edit project form
exports.getEditProjectForm = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project || project.user.toString() !== req.user._id.toString()) {
      return res.status(404).send('Project not found or unauthorized');
    }

    res.render('edit-project', { project });
  } catch (err) {
    console.error('Error loading edit form:', err);
    res.status(500).send('Error loading edit form');
  }
};


// GET route to render edit project form
exports.getInviteCollaboratorsForm = async (req, res) => {
  try {
    const { id: projectId } = req.params;
    const project = await Project.findById(projectId).populate('collaborators');

    if (!project || project.user.toString() !== req.user._id.toString()) {
      return res.status(404).send('Project not found or unauthorized');
    }

    res.render('invite', {
      project,
      invitedUsers: project.collaborators
    });
  } catch (err) {
    console.error('Error loading invite form:', err);
    res.status(500).send('Error loading invite form');
  }
};

exports.searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const users = await User.find({
      username: { $regex: new RegExp(username, 'i') },
      _id: { $ne: req.user._id } // exclude self from search results
    }).select('username'); // only return username field

    res.json(users);
  } catch (err) {
    console.error('Error searching users:', err);
    res.status(500).json({ error: 'Server error while searching users' });
  }
};

exports.addCollaborator = async (req, res) => {
  try {
    const { username, projectId } = req.body;

    const userToAdd = await User.findOne({ username });
    if (!userToAdd) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Avoid duplicate collaborators
    if (!project.collaborators.includes(userToAdd.username)) {
      project.collaborators.push(userToAdd.username);
      await project.save();
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    res.status(500).json({ success: false, message: 'Error adding collaborator' });
  }
};




