import Registration from '../models/Registration.js';
import Student from '../models/Student.js';
import Event from '../models/Event.js';

export async function createRegistration(req, res, next) {
  try {
    const { studentId, eventId } = req.body;
    if (!studentId || !eventId) return res.status(400).json({ message: 'studentId and eventId are required' });
    const [student, event] = await Promise.all([Student.findById(studentId), Event.findById(eventId)]);
    if (!student) return res.status(404).json({ message: 'Student not found. Create a student profile first.' });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const existing = await Registration.findOne({ student: studentId, event: eventId });
    if (existing) return res.status(409).json({ message: 'This student is already registered for this event.' });
    const count = await Registration.countDocuments({ event: eventId });
    if (count >= event.capacity) return res.status(409).json({ message: 'This event has reached its registration capacity.' });
    const registration = await Registration.create({ student: studentId, event: eventId });
    const populated = await registration.populate(['student', 'event']);
    res.status(201).json(populated);
  } catch (error) { next(error); }
}

export async function getRegistrations(req, res, next) {
  try {
    const filter = {};
    if (req.query.eventId) filter.event = req.query.eventId;
    if (req.query.studentId) filter.student = req.query.studentId;
    const registrations = await Registration.find(filter).populate('student').populate('event').sort({ registrationDate: -1 });
    res.json(registrations);
  } catch (error) { next(error); }
}

export async function deleteRegistration(req, res, next) {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });
    res.json({ message: 'Registration cancelled successfully' });
  } catch (error) { next(error); }
}
