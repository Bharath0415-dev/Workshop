import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  date: { type: Date, required: true },
  venue: { type: String, required: true, trim: true },
  capacity: { type: Number, required: true, min: 1 },
  category: { type: String, enum: ['Workshop', 'Seminar', 'Technical', 'Cultural', 'Other'], default: 'Workshop' },
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
