const collection = require('../Models/userModel');
const bcrypt = require('bcrypt');
const Project = require('../Models/project');



module.exports = {
    welcome: (req, res) => {
        res.render('index.ejs');
    },
    register: (req, res) => {
        res.render('Register.ejs');
    },
    AdminHome: async (req, res) => {
        const freshUser = await collection.findById(req.user._id);
        res.render('AdminHome.ejs', { user: freshUser });
    },
    ResearcherHome: async (req, res) => {
        try {
            // Fetch the full user document
            const freshUser = await collection.findById(req.user._id);
    
            // Find projects where the user is the owner or a collaborator
            const projects = await Project.find({
                $or: [
                    { user: freshUser._id },
                    { collaborators: freshUser.username }
                ]
            });
    
            // Render the view with both owned and collaborated projects
            res.render('ResearcherHome.ejs', { user: freshUser, projects: projects || [] });
        } catch (err) {
            console.error('Error fetching projects:', err);
            res.status(500).send('Error retrieving your projects');
        }
    },
    ReviewerHome: async (req, res) => {
        const freshUser = await collection.findById(req.user._id);
        res.render('ReviewerHome.ejs', { user: freshUser });
    },
    login: (req, res) => {
        res.render('login', { error: null });
    }
};
