const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Register user
router.post('/register', async (req, res) => {
  try {
    const user = await User.create(req.body);
    
    // Create token
    const token = user.getSignedJwtToken();
    
    res.status(201).json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Please provide email and password' });
  }
  
  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    // Create token
    const token = user.getSignedJwtToken();
    
    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  // This route would normally have authentication middleware
  // For now, we're leaving it as a placeholder
  res.status(200).json({ 
    success: true, 
    message: 'This route will return the current user after authentication is implemented' 
  });
});

module.exports = router;