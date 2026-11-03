import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import eventRoutes from './routes/eventRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import Event from './models/Event.js';
import Student from './models/Student.js';
import Registration from './models/Registration.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'CampusConnect API is running' }));
app.get('/api/dashboard/stats', async (req, res, next) => {
  try {
    const [totalEvents, totalStudents, totalRegistrations, upcomingEvents] = await Promise.all([
      Event.countDocuments(), Student.countDocuments(), Registration.countDocuments(),
      Event.countDocuments({ status: 'Upcoming', date: { $gte: new Date() } })
    ]);
    res.json({ totalEvents, totalStudents, totalRegistrations, upcomingEvents });
  } catch (error) { next(error); }
});
app.use('/api/events', eventRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/registrations', registrationRoutes);

app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((error, req, res, next) => {
  console.error(error);
  if (error.name === 'ValidationError') return res.status(400).json({ message: Object.values(error.errors).map(e => e.message).join(', ') });
  if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid ID format' });
  if (error.code === 11000) return res.status(409).json({ message: 'A student with this USN or email already exists, or this registration already exists.' });
  res.status(500).json({ message: error.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, () => console.log(`CampusConnect API running at http://localhost:${PORT}`)))
  .catch(error => { console.error('Could not start server:', error.message); process.exit(1); });

process.on('SIGINT', async () => { await mongoose.connection.close(); process.exit(0); });
