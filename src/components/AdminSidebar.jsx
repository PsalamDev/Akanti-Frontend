import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, Users, ScrollText, ArrowLeft, Moon, Sun, LogOut } from 'lucide-react';

const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} />, end: true },
  { to: '/admin/users', label: 'Users', icon: <Users size={20} /> },
  { to: '/admin/audit-logs', label: 'Audit Logs', icon: <ScrollText size={20} /> },
];

export default function AdminSidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-900 dark:bg-gray-950 text-white transform transition-transform duration-200 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:translate-x-0`}>
        <div className="flex items-center justify-center h-16 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <img src="/akanti-logo.jpeg" alt="Akanti" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-xl font-bold">Akanti Admin</span>
          </div>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </NavLink>
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-3 space-y-1">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
