import { useEffect, useState } from 'react';
import { CalendarDays, Users, ClipboardList, CalendarClock, ArrowUpRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStats, getEvents, getErrorMessage } from '../services/api.js';
import EventCard from '../components/EventCard.jsx';

const initialStats = [{ key: 'totalEvents', label: 'Total events', icon: CalendarDays, tone: 'purple' }, { key: 'totalStudents', label: 'Registered students', icon: Users, tone: 'blue' }, { key: 'totalRegistrations', label: 'Total registrations', icon: ClipboardList, tone: 'green' }, { key: 'upcomingEvents', label: 'Upcoming events', icon: CalendarClock, tone: 'orange' }];
export default function Dashboard() {
  const [stats, setStats] = useState({}); const [events, setEvents] = useState([]); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  useEffect(() => { async function load() { try { const [s, e] = await Promise.all([getStats(), getEvents()]); setStats(s.data); setEvents(e.data.slice(0, 3)); } catch (err) { setError(getErrorMessage(err)); } finally { setLoading(false); } } load(); }, []);
  return <>
    <div className="welcome-row"><div><div className="eyebrow">MONDAY, YOUR CAMPUS AT A GLANCE</div><h1>Good morning, <span>Coordinator.</span></h1><p>Here's what's happening across your campus events.</p></div><Link className="primary-button" to="/events"><Plus size={17}/> Create an event</Link></div>
    {error && <div className="alert error">{error}. Check that the backend and MongoDB are running.</div>}
    <section className="stats-grid">{initialStats.map(({ key, label, icon: Icon, tone }) => <div className="stat-card" key={key}><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-label">{label}</div><div className="stat-number">{loading ? '—' : (stats[key] ?? 0)}</div><div className="stat-foot">Live from your database</div></div>)}</section>
    <div className="section-heading"><div><div className="eyebrow">WHAT'S COMING UP</div><h2>Upcoming events</h2><p>Discover and manage the latest campus activities.</p></div><Link className="subtle-link" to="/events">View all events <ArrowUpRight size={16}/></Link></div>
    {loading ? <div className="empty-state">Loading events…</div> : events.length ? <div className="event-grid">{events.map(event => <EventCard key={event._id} event={event}/>)}</div> : <div className="empty-state">No events yet. Create your first campus event.</div>}
    <div className="integration-banner"><div className="integration-symbol">⌘</div><div><strong>Your campus, connected.</strong><p>React powers the interface, Express handles requests, Node.js runs the server and MongoDB stores your data.</p></div><span className="stack-tags">M <i>·</i> E <i>·</i> R <i>·</i> N</span></div>
  </>;
}
