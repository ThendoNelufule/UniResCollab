const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./Routes/authRoutes');
const userRoute = require('./Routes/userRoutes');
const expressLayouts = require('express-ejs-layouts');
const projectRouter = require('./Routes/projectRouter.js');
const toolsRouter = require('./Routes/toolsRouter.js');
const methodOverride = require('method-override');
const { DB } = require('./config/database');
const Message = require('./Models/Message'); // Import Message model
require('dotenv').config({ path: path.join(__dirname,'..', '.env') });

const app = express();
const http = require('http').createServer(app); // Create HTTP server
const io = require('socket.io')(http);

const PORT = process.env.PORT || 4000;

// Middlewares
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layouts');
app.set('views', path.join(__dirname, '..','FrontEnd', 'views'));
app.use(express.static(path.join(__dirname, '..','FrontEnd')));
app.use(express.static(path.join(__dirname, '..','public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Routes
app.use('/auth', authRoutes);
app.use('/', authRoutes);
app.use('/', userRoute);
app.use('/researcher/projects', projectRouter);
app.use('/tools', toolsRouter);

// Admin Home
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

// Socket.IO handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // When a user joins the chat, assign them to a room named after their user id
  socket.on('join', async (data) => {
    const { userId, friendId } = data; // Destructure to get both userId and friendId
    socket.join(userId);
    console.log(`User ${userId} joined their room`);

    // Fetch all previous messages between the two users (in case they reconnect)
    const messages = await Message.find({
        $or: [
            { sender: userId, recipient: friendId },
            { sender: friendId, recipient: userId }
        ]
    }).sort({ timestamp: 1 });

    // Emit all previous messages to the user
    socket.emit('chat history', messages);
});


  socket.on('chat message', async (data) => {
    try {
      const { from, to, text } = data;
      const message = await Message.create({
        sender: from,
        recipient: to,
        text,
        timestamp: new Date()
      });
  
      // Send the message ONLY to sender and recipient
      io.to(from).to(to).emit('chat message', message);
  
      // Ensure message is saved in the database even if the user is offline
      await message.save(); // Make sure this is a database save
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start server
const startServer = async () => {
  try {
    await DB();
    http.listen(PORT, () => { // Listen on HTTP server, not app
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server due to DB error", err);
  }
};

startServer();
