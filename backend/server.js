import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';


dotenv.config();
const app = express();
//const authRoutes =  require('./routes/auth.routes');
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
connectDB();
//app.use('/api/auth', authRoutes);
app.get('/',(req,res)=>{
    res.send('API is running...');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port http://localhost:${PORT}`));