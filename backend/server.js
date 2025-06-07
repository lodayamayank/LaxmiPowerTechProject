import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import attendanceRoutes from './routes/attendance.routes.js';
import authRoutes from './routes/auth.routes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
 // 👈 your frontend URL
const PORT = process.env.PORT || 5000;
app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.options('/api/attendance/punch', cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use('/api/auth', authRoutes);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
