import { CalendarDays, MapPin, Users, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  const date = new Date(event.date);
  const filled = event.registrationCount || 0;
  return <article className="event-card">
    <div className="event-card-top"><span className={`category-pill ${event.category?.toLowerCase()}`}>{event.category}</span><span className="status-pill">{event.status}</span></div>
    <h3>{event.title}</h3><p className="event-description">{event.description}</p>
    <div className="event-meta"><span><CalendarDays size={15}/>{date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span><span><MapPin size={15}/>{event.venue}</span><span><Users size={15}/>{filled}/{event.capacity} registered</span></div>
    <div className="capacity-track"><span style={{ width: `${Math.min(100, (filled / event.capacity) * 100)}%` }} /></div>
    <div className="card-bottom"><span className="capacity-label">{Math.max(0, event.capacity - filled)} seats remaining</span><Link className="text-link" to={`/registrations?eventId=${event._id}`}>View registrations <ArrowUpRight size={15}/></Link></div>
  </article>;
}
