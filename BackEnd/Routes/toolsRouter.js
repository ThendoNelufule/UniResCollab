const express = require('express');
const router = express.Router();
const toolsController = require('../Controllers/toolsController');
const { ensureAuthenticated, ensureResearcher } = require('../middleware/authMiddleware');
const Message = require('../Models/Message');
const User = require('../Models/userModel');


router.get('/admin/analysis', (req, res) => {
    res.render('analysis.ejs');
});

router.get('/review/feedbacks', (req, res) => {
    res.render('feedback.ejs');
});

router.get('/review/publications', (req, res) => {
    res.render('publication.ejs');
});

router.get('/review/reviews', (req, res) => {
    res.render('reviews.ejs');
});

router.get('/fund', (req, res) => {
    res.render('funds.ejs');
});

router.get('/friends', async (req, res) => {
    try {
        if (!req.user) {
            return res.redirect('/login');
        }

        const userId = req.user._id;

        const users = await User.find({ _id: { $ne: userId } });

        res.render('friends', { users });
    } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/chat/:friendId', async (req, res) => {
    try {
        const userId = req.user._id;
        const friendId = req.params.friendId;

        // Fetch all messages between the two users, sorted by timestamp
        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: friendId },
                { sender: friendId, recipient: userId }
            ]
        }).sort({ timestamp: 1 }); // Sorted by timestamp to show in order

        const friend = await User.findById(friendId); // Get friend's details

        // Pass the messages to the view to be displayed
        res.render('chat', {
            messages,
            currentUserId: userId,
            friendId: friendId,
            friendName: friend.username
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});





router.post('/send-message', async (req, res) => {
    try {
        const senderId = req.user._id;
        const { text, recipientId } = req.body;

        const newMessage = new Message({
            from: senderId,
            to: recipientId,
            text,
            timestamp: new Date()
        });

        await newMessage.save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Failed to save message', err);
        res.status(500).json({ success: false });
    }
});


module.exports = router;
