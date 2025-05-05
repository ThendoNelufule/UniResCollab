const express = require('express');
const router = express.Router();
const toolsController = require('../Controllers/toolsController');
const { ensureAuthenticated, ensureResearcher } = require('../middleware/authMiddleware');
const Message = require('../Models/Message');
const User = require('../Models/userModel');
const Funding = require('../Models/Funding');
const FundingRequirement = require('../Models/FundingRequirement');
const Expense = require('../Models/Expense');

  
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

        
        const messages = await Message.find({
            $or: [
                { sender: userId, recipient: friendId },
                { sender: friendId, recipient: userId }
            ]
        }).sort({ timestamp: 1 }); 

        const friend = await User.findById(friendId); 

        
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



router.get('/funding/overview', async (req, res) => {
    try {
      const funding = await Funding.findOne({ createdBy: req.user._id });
  
      if (!funding) {
        return res.render('FundingOverview', { funding: null });
      }
  
      const expenses = await Expense.find({ createdBy: req.user._id });
      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const remaining = funding.totalAmount - totalSpent;
      const percentUsed = funding.totalAmount > 0 ? (totalSpent / funding.totalAmount) * 100 : 0;
  
      res.render('FundingOverview', {
        funding,
        totalSpent,
        remaining,
        percentUsed: percentUsed.toFixed(1)
      });
    } catch (err) {
      console.error('Error fetching funding:', err);
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






// GET /tools/funding
router.get('/funding', async (req, res) => {
    try {
      const funding = await Funding.findOne(); 
      const expenses = await Expense.find({});
  
      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const remaining = funding.total - totalSpent;
  
      res.render('tools/funding/overview', {
        funding,
        totalSpent,
        remaining,
      });
    } catch (err) {
      console.error('Error loading funding overview:', err);
      res.render('tools/funding/overview', {
        funding: {},
        totalSpent: 0,
        remaining: 0,
        error: 'Could not load funding overview.',
      });
    }
  });
  

router.post('/funding', async (req, res) => {
  try {
    const { fundingTitle, fundingSource, totalAmount, startDate, endDate } = req.body;

    
    const existingFunding = await Funding.findOne({ createdBy: req.user._id });
    if (existingFunding) {
      
      return res.status(400).send('You already have a funding entry. Cannot create more than one.');
    }

    const newFunding = new Funding({
      title: fundingTitle,
      source: fundingSource,
      totalAmount,
      startDate,
      endDate,
      createdBy: req.user._id
    });

    await newFunding.save();
    res.redirect('/tools/funding/overview');
  } catch (err) {
    console.error('Error saving funding:', err);
    res.status(500).send('Something went wrong');
  }
});


router.get('/funding/requirements', async (req, res) => {
    try {
      const requirements = req.user
        ? await FundingRequirement.find({ createdBy: req.user._id })
        : [];
  
      const error = req.query.error || null;
      res.render('FundingRequriements', { requirements, error });
    } catch (err) {
      console.error('Error loading requirements:', err);
      res.render('FundingRequriements', { requirements: [], error: 'Failed to load requirements' });
    }
  });
  
  
  
  
  router.post('/funding/requirements', ensureAuthenticated, async (req, res) => {
    try {
      const { category, plannedBudget, notes } = req.body;
  
      if (!req.user || !req.user._id) {
        return res.status(401).send('User not authenticated');
      }
  
      const funding = await Funding.findOne({ createdBy: req.user._id });
      if (!funding) {
        return res.redirect('/tools/funding/requirements?error=No active funding found.');
      }
  
      const newRequirement = new FundingRequirement({
        category,
        plannedBudget,
        notes,
        createdBy: req.user._id,
        fundingId: funding._id
      });
  
      await newRequirement.save();
      res.redirect('/tools/funding/requirements');
    } catch (err) {
      res.status(500).send('Failed to add requirement');
    }
  });



  router.delete('/funding/requirements/:id',async (req, res) => {
    try {
      await FundingRequirement.findByIdAndDelete(req.params.id);
      res.redirect('/tools/funding/requirements');
    } catch (err) {
      console.error('Delete failed:', err);
      res.status(500).send('Failed to delete');
    }
  });


  router.post('/funding/requirements/:id/update', ensureAuthenticated, async (req, res) => {
    try {
      const { category, plannedBudget, notes } = req.body;
  
      await FundingRequirement.findByIdAndUpdate(
        req.params.id,
        {
          category,
          plannedBudget,
          notes
        }
      );
  
      res.redirect('/tools/funding/requirements');
    } catch (err) {
      res.status(500).send('Failed to update requirement');
    }
  });


 

  router.get('/funding/expenses', ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user._id;
  
      const funding = await Funding.findOne({ createdBy: userId }).sort({ createdAt: -1 });
      if (!funding) {
        return res.render('ExpenseTracker', {
          expenses: [],
          remaining: 0,
          error: 'No funding record found.'
        });
      }
  
      const expenses = await Expense.find({ createdBy: userId });
  
      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const remaining = funding.totalAmount - totalSpent;
  
      res.render('ExpenseTracker', {
        expenses,
        remaining,
        error: null
      });
    } catch (err) {
      console.error('Expense Tracker Load Error:', err);
      res.render('ExpenseTracker', {
        expenses: [],
        remaining: 0,
        error: 'Could not load expense data.'
      });
    }
  });
  
  
  
  router.post('/funding/expenses', ensureAuthenticated, async (req, res) => {
    try {
      const { date, description, amount } = req.body;
      const userId = req.user._id;
  
      const funding = await Funding.findOne({ createdBy: userId }).sort({ createdAt: -1 });
  
      if (!funding) {
        return res.render('ExpenseTracker', {
          expenses: [],
          remaining: 0,
          error: 'No funding record found.'
        });
      }
  
      const expense = new Expense({
        date,
        description,
        amount: parseFloat(amount),
        createdBy: userId,
        fundingId: funding._id
      });
  
      await expense.save();
      res.redirect('/tools/funding/expenses');
    } catch (err) {
      console.error('Error saving expense:', err);
      res.render('ExpenseTracker', {
        expenses: [],
        remaining: 0,
        error: 'Failed to add expense.'
      });
    }
  });
  
  

  router.post('/funding/expenses/:id/update', ensureAuthenticated, async (req, res) => {
    try {
      const { date, description, amount } = req.body;
      const userId = req.user._id;
  
      const expense = await Expense.findOne({ _id: req.params.id, createdBy: userId });
      if (!expense) {
        return res.status(404).send('Expense not found or not yours');
      }
  
      expense.date = date;
      expense.description = description;
      expense.amount = parseFloat(amount);
      await expense.save();
  
      res.redirect('/tools/funding/expenses');
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).send('Could not update expense.');
    }
  });  


  // DELETE Expense
  router.post('/funding/expenses/:id/delete', ensureAuthenticated, async (req, res) => {
    try {
      const userId = req.user._id;
  
      const expense = await Expense.findOne({ _id: req.params.id, createdBy: userId });
      if (!expense) {
        return res.status(404).send('Expense not found or not yours');
      }
  
      await expense.deleteOne();
      res.redirect('/tools/funding/expenses');
    } catch (err) {
      console.error('Error deleting expense:', err);
      res.status(500).send('Failed to delete expense');
    }
  });
  



  module.exports = router;
