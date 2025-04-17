const express=require('express')
const controller=require('../Controllers/userController')
const router = express.Router();
const OAuthUser = require('../Models/userModel');


//These are the routes rendering each ejs page
router.get('/',controller.welcome)

router.get('/about',function(req,res){
    res.render('about.ejs')
});
router.get('/username',function(req,res){
    res.render('Username.ejs');
});
router.get('/roles',function(req,res){
    res.render('roles.ejs');
});

router.get('/Admin/Home',controller.AdminHome)

router.get('/Researcher/Home',controller.ResearcherHome)

router.get('/Reviewer/Home',controller.ReviewerHome)

router.get('/login',controller.login)
// router.post('/login',controller.loginFill)

router.get('/register',controller.register)
// router.post('/register',controller.registerFill)

router.get('/AI-Page',function(req,res){
  res.render('AI-Page');
});

// Here I am setting a user's role in the database after he select the role
router.get('/set-role', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/login');
    }
  
    const selectedRole = req.query.role;
  
    if (!selectedRole) {
      return res.status(400).send("Role not selected");
    }
  
    try {
      await OAuthUser.findOneAndUpdate(
        { providerId: req.user.providerId },
        { role: selectedRole }
      );
  
      res.redirect('/username'); 
    } catch (err) {
      console.error("Failed to update role:", err);
      res.status(500).send("Something went wrong");
    }
  });
  

  // Here I am setting a user's username in the database after he writes his name
  router.post('/username', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }

    const username = req.body.username;

    if (!username || username.length < 6) {
        return res.render('Username', { error: 'Username must be at least 6 characters.' });
    }

    try {
        const user = await OAuthUser.findOneAndUpdate(
            { providerId: req.user.providerId },
            { username: username },
            { new: true }
        );

        // This is for taking a user to their correct home page depending on their role
        if (user.role === 'Admin') return res.redirect('/Admin/Home');
        if (user.role === 'Reviewer') return res.redirect('/Reviewer/Home');
        if (user.role === 'Researcher') return res.redirect('/Researcher/Home');

        // default fallback
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;