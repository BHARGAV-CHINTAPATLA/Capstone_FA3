const express = require('express');
const router = express.Router();
const goalService = require('../services/goalService');
const authenticateJWT = require('../utilities/authenticateJWT');
const { validateGoal } = require('../utilities/validateRequest');
const asyncHandler = require('../utilities/asyncHandler');

// Create a goal
router.post('/goals', authenticateJWT, validateGoal, asyncHandler(async (req, res) => {
  const goal = await goalService.createGoalForUser(req.user._id, req.body);
  res.status(201).json({ message: 'Goal created successfully', goal });
}));

// List user's goals
router.get('/goals', authenticateJWT, asyncHandler(async (req, res) => {
  const goals = await goalService.getUserGoals(req.user._id);
  res.status(200).json({ goals });
}));

// Edit goal details (title / linkedExercise)
router.patch('/goals/:id', authenticateJWT, validateGoal, asyncHandler(async (req, res) => {
  const goal = await goalService.updateGoalForUser(req.params.id, req.user._id, req.body);
  res.status(200).json({ message: 'Goal updated successfully', goal });
}));

// Toggle isDoneToday
router.patch('/goals/:id/toggle', authenticateJWT, asyncHandler(async (req, res) => {
  const goal = await goalService.toggleGoalForUser(req.params.id, req.user._id);
  res.status(200).json({ message: 'Goal status toggled successfully', goal });
}));

// Delete a goal
router.delete('/goals/:id', authenticateJWT, asyncHandler(async (req, res) => {
  await goalService.deleteGoalForUser(req.params.id, req.user._id);
  res.status(200).json({ message: 'Goal deleted successfully' });
}));

module.exports = router;
