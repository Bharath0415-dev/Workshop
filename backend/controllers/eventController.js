import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

export async function getEvents(req, res, next) {
  try {
    const filter = {};
    if (req.query.search) filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { venue: { $regex: req.query.search, $options: 'i' } },
      { category: { $regex: req.query.search, $options: 'i' } }
    ];
    if (req.query.status) filter.status = req.query.status;
    const events = await Event.find(filter).sort({ date: 1 });
    const counts = await Registration.aggregate([
      { $group: { _id: '$event', count: { $sum: 1 } } }
    ]);
    const countMap = new Map(counts.map(item => [String(item._id), item.count]));
    res.json(events.map(event => ({ ...event.toObject(), registrationCount: countMap.get(String(event._id)) || 0 })));
  } catch (error) { next(error); }
}

export async function getEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const registrationCount = await Registration.countDocuments({ event: event._id });
    res.json({ ...event.toObject(), registrationCount });
  } catch (error) { next(error); }
}

export async function createEvent(req, res, next) {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) { next(error); }
}

export async function updateEvent(req, res, next) {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) { next(error); }
}

export async function deleteEvent(req, res, next) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    const registrations = await Registration.countDocuments({ event: event._id });
    if (registrations > 0) return res.status(409).json({ message: 'Cannot delete an event that has registrations. Cancel registrations first.' });
    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) { next(error); }
}
