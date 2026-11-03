import { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, X } from 'lucide-react';
import { createEvent, deleteEvent, getEvents, updateEvent, getErrorMessage } from '../services/api.js';
import EventCard from '../components/EventCard.jsx';
import Modal from '../components/Modal.jsx';

const blank = { title: '', description: '', date: '', venue: '', capacity: 50, category: 'Workshop', status: 'Upcoming' };
export default function Events() {
  const [events, setEvents] = useState([]); const [search, setSearch] = useState(''); const [modal, setModal] = useState(false); const [editing, setEditing] = useState(null); const [form, setForm] = useState(blank); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function load() { try { const { data } = await getEvents(search ? { search } : {}); setEvents(data); setError(''); } catch (e) { setError(getErrorMessage(e)); } }
  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [search]);
  function openCreate() { setEditing(null); setForm(blank); setError(''); setModal(true); }
  function openEdit(event) { setEditing(event); setForm({ ...event, date: new Date(event.date).toISOString().slice(0, 16) }); setError(''); setModal(true); }
  function change(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.name === 'capacity' ? Number(e.target.value) : e.target.value })); }
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); try { const payload = { ...form, date: new Date(form.date).toISOString() }; if (editing) await updateEvent(editing._id, payload); else await createEvent(payload); setModal(false); await load(); } catch (err) { setError(getErrorMessage(err)); } finally { setBusy(false); } }
  async function remove(event) { if (!window.confirm(`Delete "${event.title}"?`)) return; try { await deleteEvent(event._id); await load(); } catch (e) { setError(getErrorMessage(e)); } }
  return <>
    <div className="page-title-row"><div><div className="eyebrow">CAMPUS ACTIVITIES</div><h1>Events</h1><p>Create, update and discover campus events.</p></div><button className="primary-button" onClick={openCreate}><Plus size={17}/> Add event</button></div>
    {error && <div className="alert error">{error}</div>}
    <div className="toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events, venues or categories…"/></div><span className="result-count">{events.length} events found</span></div>
    {events.length ? <div className="event-grid">{events.map(event => <div className="event-management-card" key={event._id}><EventCard event={event}/><div className="management-actions"><button className="small-button" onClick={() => openEdit(event)}><Pencil size={14}/> Edit</button><button className="small-button danger-button" onClick={() => remove(event)}><Trash2 size={14}/> Delete</button></div></div>)}</div> : <div className="empty-state"><CalendarIcon/><strong>No events found</strong><span>Create an event or try a different search.</span></div>}
    {modal && <Modal title={editing ? 'Update event' : 'Create a new event'} onClose={() => setModal(false)}><form className="form-grid" onSubmit={submit}>
      <label className="full-field">Event title<input name="title" value={form.title} onChange={change} required maxLength="100" placeholder="e.g. Full Stack Development Workshop"/></label>
      <label className="full-field">Description<textarea name="description" value={form.description} onChange={change} required rows="3" placeholder="What is this event about?"/></label>
      <label>Event date and time<input type="datetime-local" name="date" value={form.date} onChange={change} required/></label>
      <label>Venue<input name="venue" value={form.venue} onChange={change} required placeholder="MCA Seminar Hall"/></label>
      <label>Capacity<input type="number" name="capacity" value={form.capacity} onChange={change} required min="1"/></label>
      <label>Category<select name="category" value={form.category} onChange={change}><option>Workshop</option><option>Seminar</option><option>Technical</option><option>Cultural</option><option>Other</option></select></label>
      <label>Status<select name="status" value={form.status} onChange={change}><option>Upcoming</option><option>Ongoing</option><option>Completed</option></select></label>
      {error && <div className="alert error full-field">{error}</div>}
      <div className="modal-actions full-field"><button type="button" className="secondary-button" onClick={() => setModal(false)}>Cancel</button><button className="primary-button" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Create event'}</button></div>
    </form></Modal>}
  </>;
}
function CalendarIcon() { return <div className="empty-icon"><CalendarDaysFallback/></div>; }
function CalendarDaysFallback() { return <span>✦</span>; }
