import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  usn: { type: String, required: true, trim: true, uppercase: true, unique: true },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true },
  department: { type: String, default: 'MCA', trim: true }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
