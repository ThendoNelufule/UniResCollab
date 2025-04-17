const  collection  = require('../Models/userModel');
const bcrypt=require('bcrypt');

module.exports = {
    welcome:(req,res)=>{
        res.render('index.ejs');
    },
    register:(req,res)=>{
        res.render('Register.ejs');
    },
    AdminHome: async (req, res) => {
        const freshUser = await collection.findById(req.user._id);
        res.render('AdminHome.ejs', { user: freshUser });
    },
    ResearcherHome: async (req, res) => {
        const freshUser = await collection.findById(req.user._id);
        res.render('ResearcherHome.ejs', { user: freshUser });
    },
    ReviewerHome: async (req, res) => {
        const freshUser = await collection.findById(req.user._id);
        res.render('ReviewerHome.ejs', { user: freshUser });
    },
    login: (req, res) => {
        res.render('login',{error:null});
    },
}