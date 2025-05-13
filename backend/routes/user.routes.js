import express from 'express';
import User from '../models/User.js';
import protect from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';

const router = express.Router();

// GET all users (Dashboard feature) — only super_admin and office_staff
router.get('/', protect, checkRole('super_admin', 'office_staff'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Create new user - Only super_admin can create
router.post('/', protect, checkRole('super_admin'), async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
  
      // Check for existing user
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'User already exists' });
  
      // Hash password
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash(password, 10);
  
      // Create user
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
  
      res.status(201).json({ message: 'User created successfully', user });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create user', error: err.message });
    }
  });
  
  // Update user - Super admin or office staff
router.put('/:id', protect, checkRole('super_admin', 'office_staff'), async (req, res) => {
    try {
      const { name, email, role } = req.body;
      const updated = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, role },
        { new: true }
      ).select('-password');
  
      res.json({ message: 'User updated', user: updated });
    } catch (err) {
      res.status(500).json({ message: 'Failed to update user', error: err.message });
    }
  });
  
  // Delete user - Only super_admin
router.delete('/:id', protect, checkRole('super_admin'), async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Failed to delete user', error: err.message });
    }
  });
  
export default router;
