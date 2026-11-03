import { useEffect, useState } from 'react';
import { Plus, Search, Users } from 'lucide-react';
import { createStudent, getStudents, getErrorMessage } from '../services/api.js';
import Modal from '../components/Modal.jsx';

export default function Students() {
  const [students, setStudents] = useState([]); const [search, setSearch] = useState(''); const [show, setShow] = useState(false); const [form, setForm] = useState({ name: '', usn: '', email: '', department: 'MCA' }); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function load() { try { const { data } = await getStudents(); setStudents(data); } catch (e) { setError(getErrorMessage(e)); } }
  useEffect(() => { load(); }, []);
  const filtered = students.filter(s => `${s.name} ${s.usn} ${s.email}`.toLowerCase().includes(search.toLowerCase()));
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); try { await createStudent(form); setForm({ name: '', usn: '', email: '', department: 'MCA' }); setShow(false); await load(); } catch (e) { setError(getErrorMessage(e)); } finally { setBusy(false); } }
  return <>
    <div className="page-title-row"><div><div className="eyebrow">PEOPLE DIRECTORY</div><h1>Students</h1><p>Manage student profiles for event registrations.</p></div><button className="primary-button" onClick={() => { setError(''); setShow(true); }}><Plus size={17}/> Add student</button></div>
    {error && !show && <div className="alert error">{error}</div>}
    <div className="toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, USN or email…"/></div><span className="result-count">{filtered.length} students</span></div>
    <div className="table-card"><table><thead><tr><th>STUDENT</th><th>USN</th><th>EMAIL ADDRESS</th><th>DEPARTMENT</th></tr></thead><tbody>{filtered.map(s => <tr key={s._id}><td><div className="student-cell"><div className="student-avatar">{s.name.charAt(0).toUpperCase()}</div><strong>{s.name}</strong></div></td><td><span className="usn-tag">{s.usn}</span></td><td>{s.email}</td><td>{s.department}</td></tr>)}</tbody></table>{!filtered.length && <div className="empty-state">{students.length ? 'No matching students.' : 'No students added yet. Add a student to enable event registration.'}</div>}</div>
    {show && <Modal title="Add student profile" onClose={() => setShow(false)}><form className="form-grid" onSubmit={submit}><label className="full-field">Full name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="Student name"/></label><label>USN<input value={form.usn} onChange={e => setForm({ ...form, usn: e.target.value })} required placeholder="e.g. MCA004"/></label><label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required placeholder="student@example.com"/></label><label>Department<input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required/></label>{error && <div className="alert error full-field">{error}</div>}<div className="modal-actions full-field"><button type="button" className="secondary-button" onClick={() => setShow(false)}>Cancel</button><button className="primary-button" disabled={busy}>{busy ? 'Saving…' : 'Add student'}</button></div></form></Modal>}
  </>;
}
