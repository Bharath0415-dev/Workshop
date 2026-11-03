import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import Event from './models/Event.js';
import Student from './models/Student.js';
import Registration from './models/Registration.js';

await connectDB();
await Promise.all([Registration.deleteMany({}), Event.deleteMany({}), Student.deleteMany({})]);
const students = await Student.insertMany([
  { name: 'Aarav Sharma', usn: 'MCA001', email: 'aarav@example.com', department: 'MCA' },
  { name: 'Diya Rao', usn: 'MCA002', email: 'diya@example.com', department: 'MCA' },
  { name: 'Kiran Kumar', usn: 'MCA003', email: 'kiran@example.com', department: 'MCA' }
]);
const events = await Event.insertMany([
  { title: 'Full Stack Development Workshop', description: 'A hands-on introduction to building and integrating a full-stack application.', date: new Date(Date.now() + 7 * 86400000), venue: 'MCA Seminar Hall', capacity: 60, category: 'Workshop', status: 'Upcoming' },
  { title: 'AI & Innovation Seminar', description: 'Explore practical applications and emerging directions in artificial intelligence.', date: new Date(Date.now() + 14 * 86400000), venue: 'Auditorium', capacity: 100, category: 'Seminar', status: 'Upcoming' },
  { title: 'Web Development Hackathon', description: 'Work in teams to design and build a working web application.', date: new Date(Date.now() + 21 * 86400000), venue: 'Innovation Lab', capacity: 40, category: 'Technical', status: 'Upcoming' }
]);
await Registration.insertMany([
  { student: students[0]._id, event: events[0]._id },
  { student: students[1]._id, event: events[0]._id },
  { student: students[2]._id, event: events[1]._id }
]);
console.log('Seed complete: 3 students, 3 events, 3 registrations created.');
await mongoose.connection.close();
