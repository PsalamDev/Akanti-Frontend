import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notificationAPI } from '../services/api';
import { Menu, Moon, Sun, Bell, Hand } from 'lucide-react';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchCount = () => {
    notificationAPI.getUnreadCount()
      .then(res => setUnreadCount(res.data.count))
      .catch(() => {});
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    const onNotificationChange = () => fetchCount();
    window.addEventListener('notifications-updated', onNotificationChange);
    return () => {
      clearInterval(interval);
      window.removeEventListener('notifications-updated', onNotificationChange);
    };
  }, []);

  const firstName = user?.fullName?.split(' ')[0] || '';
  const isDashboard = location.pathname === '/dashboard';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 1 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  };

  return (
    <header className="flex items-center justify-between h-16 bg-white dark:bg-gray-800 px-4 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
        <Menu size={24} />
      </button>
      <div className="flex items-center gap-2">
        {isDashboard && (
          <span className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">{getGreeting()}, {firstName} 👋</span>
        )}
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button onClick={() => navigate('/dashboard/notifications')} className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <Bell size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        <button onClick={() => navigate('/dashboard/profile')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold cursor-pointer">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user?.fullName}</span>
        </button>
      </div>
    </header>
  );
}
