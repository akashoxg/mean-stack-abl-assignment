/**
 * Task Routes — Express Router
 * RESTful API endpoints for CRUD operations on tasks.
 */
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// ─── GET /api/tasks — Retrieve all tasks ────────────────────
router.get('/', async (req, res) => {
  try {
    const { status, priority, sort } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    let query = Task.find(filter);

    // Sort by creation date (newest first by default)
    if (sort === 'oldest') {
      query = query.sort({ createdAt: 1 });
    } else if (sort === 'priority') {
      query = query.sort({ priority: -1, createdAt: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const tasks = await query;
    res.json({ success: true, count: tasks.length, tasks });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/tasks/:id — Retrieve a single task ────────────
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── POST /api/tasks — Create a new task ─────────────────────
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = new Task({ title, description, status, priority, dueDate });
    const saved = await task.save();
    res.status(201).json({ success: true, task: saved });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── PUT /api/tasks/:id — Update a task ──────────────────────
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, dueDate },
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, task });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, errors: messages });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── DELETE /api/tasks/:id — Delete a task ───────────────────
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── GET /api/tasks/stats/summary — Task statistics ──────────
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'pending' });
    const inProgress = await Task.countDocuments({ status: 'in-progress' });
    const completed = await Task.countDocuments({ status: 'completed' });

    res.json({
      success: true,
      stats: { total, pending, inProgress, completed }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
