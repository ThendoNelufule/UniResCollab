const express = require('express');
const router = express.Router();
const toolsController = require('../Controllers/toolsController');
const { ensureAuthenticated, ensureResearcher } = require('../middleware/authMiddleware');


router.get('/admin/analysis',function(req,res){
    res.render('analysis.ejs');
});

router.get('/review/feedbacks',function(req,res){
    res.render('feedback.ejs');
});

router.get('/review/publications',function(req,res){
    res.render('publication.ejs');
});


router.get('/review/reviews',function(req,res){
    res.render('reviews.ejs');
});

module.exports = router;