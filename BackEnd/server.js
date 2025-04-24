const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./Routes/authRoutes');
const userRoute = require('./Routes/userRoutes');
const expressLayouts = require('express-ejs-layouts');
const projectRouter = require('./Routes/projectRouter.js');
const methodOverride = require('method-override');
require('dotenv').config({ path: path.join(__dirname,'..', '.env') });
// Enable method override for form methods like DELETE and PUT

const { DB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 8080

//This Middleware is for rendering the ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts');
app.set('views', path.join(__dirname, '..','FrontEnd', 'views'));
app.use(express.static(path.join(__dirname, '..','FrontEnd')));
app.use(express.static(path.join(__dirname,'..','public')));
app.use(express.json());

// Here i initialise sessions 
app.use(express.urlencoded({ extended: true }));
app.use(session({secret:process.env.SESSION_SECRET,resave: false,saveUninitialized: false}));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use('/auth',authRoutes);
app.use('/', authRoutes);

//This is the route for users
app.use('/', userRoute);

// This is the route for projects
app.use('/researcher/projects', projectRouter);

//I am going to use this function later on...
app.get('/Admin/Home', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  res.send(`Welcome ${req.user.displayName}! <a href="/logout">Logout</a>`);
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
});



const startServer = async () => {
  try {
    await DB();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server due to DB error", err);
  }
};

startServer();
