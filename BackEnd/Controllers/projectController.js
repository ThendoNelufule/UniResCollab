const Project = require('../Models/project');

// This is the function to create project API
exports.createProject = async (req, res) => {
  try {
    const { title, description, requirements, isPublic } = req.body;

    if (!title || !description || !requirements) {
      return res.status(400).send('All fields are required.');
    }

    // Requirements is an array of required information
    let formattedRequirements;
    if (Array.isArray(requirements)) {
      formattedRequirements = requirements;
    } else {
      // Split string by comma and trim each item
      formattedRequirements = requirements.split(',').map(item => item.trim());
    }

    const newProject = new Project({
      title,
      description,
      requirements: formattedRequirements,
      isPublic: isPublic === 'true',
      createdBy: req.user._id
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
    const projects = await Project.find({ createdBy: req.user._id });
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

    if (!project || project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(404).send('Project not found');
    }

    res.render('project-details', { project });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving project details');
  }
};

//You can add a function to update the project here in this file and also for inviting collaborators
