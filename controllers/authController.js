const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Admin Login Controller function
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'mayoora_cine_rentals_super_secret_key_123!',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (err) {
    console.error('Error in login controller:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Admin Token Verification Controller function
exports.verifyToken = (req, res) => {
  try {
    return res.json({ valid: true, user: req.user });
  } catch (err) {
    console.error('Error in verification controller:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
