import { NavLink, Route, Routes } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, Users, ClipboardList, GraduationCap } from 'lucide-react';
import Dashboard from './pages/Dashboard.jsx';
import Events from './pages/Events.jsx';
import Students from './pages/Students.jsx';
import Registrations from './pages/Registrations.jsx';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/events', label: 'Events', icon: CalendarDays },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/registrations', label: 'Registrations', icon: ClipboardList }
];

export default function App() {
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><GraduationCap size={23} /></div><div><strong>CampusConnect</strong><span>EVENT MANAGEMENT</span></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{navItems.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} />{label}</NavLink>)}</nav>
      <div className="sidebar-note"><div className="note-icon">✦</div><strong>Workshop project</strong><p>Learn how MongoDB, Express, React and Node.js work together.</p><span>Built for MCA students</span></div>
      <div className="sidebar-footer">MERN STACK · LEARNING EDITION</div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Campus portal</strong></div><div className="topbar-right"><span className="live-dot" /> API-powered workspace <div className="avatar">M</div></div></header>
      <div className="page-wrap"><Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/students" element={<Students />} />
        <Route path="/registrations" element={<Registrations />} />
      </Routes></div>
      <footer className="main-footer">CampusConnect <span>•</span> A MERN Stack learning project</footer>
    </main>
  </div>;
}
