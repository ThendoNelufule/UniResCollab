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

// --- Socket.IO logic ---
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join', async ({ userId, friendId }) => {
    // Only join the user's own room
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);

    // Fetch and emit chat history between userId and friendId
    try {
      const history = await Message.find({
        $or: [
          { sender: userId,   recipient: friendId },
          { sender: friendId, recipient: userId   }
        ]
      })
      .sort({ timestamp: 1 });

      socket.emit('chat history', history);
    } catch (err) {
      console.error('Error fetching chat history:', err);
    }
  });

  socket.on('chat message', async ({ from, to, text }) => {
    try {
      // Create & save the message
      const message = new Message({
        sender:    from,
        recipient: to,
        text,
        timestamp: new Date()
      });
      await message.save();

      // Send to the sender
      socket.emit('chat message', message);
      // Send to the recipient (all sockets in room “to” except the sender)
      socket.to(to).emit('chat message', message);

    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
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
