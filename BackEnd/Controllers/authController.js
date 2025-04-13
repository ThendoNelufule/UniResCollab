const googleCallback = (req, res) => {
    if (req.user && req.user.role) {

        if (req.user.role === 'Admin') return res.redirect('/Admin/Home');
        if (req.user.role === 'Reviewer') return res.redirect('/Reviewer/Home');
        if (req.user.role === 'Researcher') return res.redirect('/Researcher/Home');
    }
    res.redirect('/roles');
};

const githubCallback = (req, res) => {
    
    //I am checking if the user exist in the database
    if (req.user && req.user.role) {
        //If he exist, I then take the user to their correct Home page depending on their role
        if (req.user.role === 'Admin') return res.redirect('/Admin/Home');
        if (req.user.role === 'Reviewer') return res.redirect('/Reviewer/Home');
        if (req.user.role === 'Researcher') return res.redirect('/Researcher/Home');
    }
    res.redirect('/roles'); 
};

const loginPage  = function(req,res){
    res.render('login');
}

module.exports = {
    googleCallback,
    githubCallback,
    loginPage,
};
