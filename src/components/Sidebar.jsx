import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, CircleDollarSign, TrendingDown, Target, ClipboardList, ArrowUpRight, FileText, Bell, User, Settings, Moon, Sun, LogOut } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/dashboard/income', label: 'Income', icon: <CircleDollarSign size={20} /> },
  { to: '/dashboard/expenses', label: 'Expenses', icon: <TrendingDown size={20} /> },
  { to: '/dashboard/budgets', label: 'Budgets', icon: <Target size={20} /> },
  { to: '/dashboard/debts', label: 'Debts', icon: <ClipboardList size={20} /> },
  { to: '/dashboard/cashflow', label: 'Cash Flow', icon: <ArrowUpRight size={20} /> },
  { to: '/dashboard/reports', label: 'Reports', icon: <FileText size={20} /> },
  { to: '/dashboard/notifications', label: 'Notifications', icon: <Bell size={20} /> },
  { to: '/dashboard/profile', label: 'Profile', icon: <User size={20} /> },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-green-800 dark:bg-gray-900 text-white transform transition-transform duration-200 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} lg:translate-x-0`}>
        <div className="flex items-center justify-center h-16 border-b border-green-700 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <img src="/akanti-logo.jpeg" alt="Akanti" className="h-8 w-8 rounded-lg object-cover" />
            <span className="text-xl font-bold">Akanti</span>
          </div>
        </div>
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-green-700 dark:bg-gray-700 text-white' : 'text-green-200 hover:bg-green-700 dark:hover:bg-gray-700 hover:text-white'}`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          {user?.isAdmin && (
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-gray-700 text-white' : 'text-green-200 hover:bg-gray-700 hover:text-white'}`}
            >
              <Settings size={20} />
              Admin Panel
            </NavLink>
          )}
        </nav>
        <div className="absolute bottom-4 left-0 right-0 px-3 space-y-1">
          <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-green-200 hover:bg-green-700 dark:hover:bg-gray-700 hover:text-white transition-colors">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-green-200 hover:bg-green-700 dark:hover:bg-gray-700 hover:text-white transition-colors">
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
