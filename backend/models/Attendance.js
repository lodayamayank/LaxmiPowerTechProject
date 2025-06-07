import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  punchType: { type: String, enum: ['in', 'out'], required: true },
  timestamp: { type: Date, default: Date.now },
  lat: Number,
  lng: Number,
  selfieUrl: String,
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
