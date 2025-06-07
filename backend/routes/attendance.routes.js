import express from 'express';
import Attendance from '../models/Attendance.js';
import authMiddleware from '../middleware/authMiddleware.js'; 
import upload from '../config/multer.js';

const router = express.Router();

router.post(
  '/punch',
  authMiddleware,
  upload.single('selfie'),
  async (req, res) => {
    try {
      const { punchType, lat, lng } = req.body;

      // ⛔ Prevent duplicate punch-in or punch-out
      const lastPunch = await Attendance.findOne({ user: req.user.id }).sort({ timestamp: -1 });
      if (lastPunch && lastPunch.punchType === punchType) {
        return res.status(400).json({ message: `Already punched ${punchType.toUpperCase()}` });
      }

      // ✅ Save new punch
      const attendance = new Attendance({
        user: req.user.id,
        punchType,
        lat,
        lng,
        selfieUrl: `/uploads/${req.file.filename}`,
      });

      await attendance.save();
      res.status(201).json({ message: 'Punch recorded', attendance });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save attendance' });
    }
  }
);
router.get(
  '/my',
  authMiddleware,
  async (req, res) => {
    try {
      const records = await Attendance.find({ user: req.user.id }).sort({ createdAt: -1 });
      res.json(records);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch attendance records' });
    }
  }
);

export default router;
