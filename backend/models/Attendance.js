import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  punchType: { type: String, enum: ['in', 'out'], required: true },
  selfieUrl: { type: String }, // we will add file upload later
  location: {
    lat: Number,
    lng: Number
  },
  timestamp: { type: Date, default: Date.now }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
