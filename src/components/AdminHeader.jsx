import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Moon, Sun } from 'lucide-react';

export default function AdminHeader({ onMenuClick }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between h-16 bg-white dark:bg-gray-800 px-4 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <button onClick={onMenuClick} className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
        <Menu size={24} />
      </button>
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user?.fullName?.charAt(0)?.toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user?.fullName}</span>
        </div>
      </div>
    </header>
  );
}
