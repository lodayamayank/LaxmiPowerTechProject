import express from 'express';
import Attendance from '../models/Attendance.js';
import protect from '../middleware/authMiddleware.js';
import checkRole from '../middleware/roleMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Punch in/out
// router.post('/punch', protect, checkRole(
//   'labour', 'subcontractor', 'supervisor', 'office_staff', 'super_admin'
// ), async (req, res) => {
//   try {
//     const { punchType, location, selfieUrl } = req.body;

//     const entry = new Attendance({
//       userId: req.user._id,
//       punchType,
//       location,
//       selfieUrl
//     });

//     await entry.save();
//     res.status(201).json({ message: 'Punch recorded', entry });
//   } catch (err) {
//     res.status(500).json({ message: 'Failed to record punch', error: err.message });
//   }
// });

// router.post('/punch', protect, checkRole(
//     'labour', 'subcontractor', 'supervisor', 'office_staff', 'super_admin'
//   ), async (req, res) => {
//     try {
//       const { punchType, location, selfieUrl } = req.body;
  
//       const entry = new Attendance({
//         userId: req.user._id,
//         punchType,
//         location,
//         selfieUrl
//       });
  
//       await entry.save();
//       res.status(201).json({ message: 'Punch recorded', entry });
//     } catch (err) {
//       res.status(500).json({ message: 'Failed to record punch', error: err.message });
//     }
//   });
// Get logs of one user (mobile history)
router.get('/user/:id', protect, async (req, res) => {
  try {
    const logs = await Attendance.find({ userId: req.params.id }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
});

// Get all logs (admin)
router.get('/', protect, checkRole('super_admin', 'office_staff'), async (req, res) => {
  try {
    const logs = await Attendance.find().populate('userId', 'name email role').sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all logs', error: err.message });
  }
});

router.post(
    '/punch',
    protect,
    checkRole('labour', 'subcontractor', 'supervisor', 'office_staff', 'super_admin'),
    upload.single('selfie'), // Add this middleware
    async (req, res) => {
      try {
        const { punchType, lat, lng } = req.body;
  
        const selfieUrl = req.file ? `/uploads/${req.file.filename}` : null;
  
        const entry = new Attendance({
          userId: req.user._id,
          punchType,
          selfieUrl,
          location: { lat, lng },
        });
  
        await entry.save();
        res.status(201).json({ message: 'Punch recorded', entry });
      } catch (err) {
        res.status(500).json({ message: 'Failed to record punch', error: err.message });
      }
    }
  );
  
export default router;
