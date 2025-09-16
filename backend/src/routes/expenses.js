const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// GET /api/expenses - Get all expenses with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate, limit = 50, page = 1 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get expenses with pagination
    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(skip);
    
    // Get total count for pagination
    const total = await Expense.countDocuments(filter);
    
    res.json({
      success: true,
      data: expenses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses',
      error: error.message
    });
  }
});

// GET /api/expenses/stats - Get expense statistics
router.get('/stats', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const filter = {};
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    
    // Get total amount
    const totalAmount = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get category breakdown
    const categoryBreakdown = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);
    
    // Get monthly spending
    const monthlySpending = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    res.json({
      success: true,
      data: {
        totalAmount: totalAmount[0]?.total || 0,
        categoryBreakdown,
        monthlySpending,
        totalExpenses: await Expense.countDocuments(filter)
      }
    });
  } catch (error) {
    console.error('Error fetching expense stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expense statistics',
      error: error.message
    });
  }
});

// POST /api/expenses - Create a new expense
router.post('/', async (req, res) => {
  try {
    const { title, amount, category, date, description, tags } = req.body;
    
    // Validate required fields
    if (!title || !amount || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, amount, and category are required'
      });
    }
    
    const expense = new Expense({
      title,
      amount: parseFloat(amount),
      category,
      date: date ? new Date(date) : new Date(),
      description,
      tags: tags || []
    });
    
    await expense.save();
    
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create expense',
      error: error.message
    });
  }
});

// GET /api/expenses/:id - Get a specific expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expense',
      error: error.message
    });
  }
});

// PUT /api/expenses/:id - Update an expense
router.put('/:id', async (req, res) => {
  try {
    const { title, amount, category, date, description, tags } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (amount) updateData.amount = parseFloat(amount);
    if (category) updateData.category = category;
    if (date) updateData.date = new Date(date);
    if (description !== undefined) updateData.description = description;
    if (tags) updateData.tags = tags;
    
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message
    });
  }
});

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Expense deleted successfully',
      data: expense
    });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message
    });
  }
});

module.exports = router;
