import { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Bell, AlertTriangle, ClipboardList, Info } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    notificationAPI.getAll()
      .then(res => setNotifications(res.data))
      .catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = (id) => {
    notificationAPI.markAsRead(id).then(() => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      window.dispatchEvent(new Event('notifications-updated'));
    }).catch(() => toast.error('Failed to mark as read'));
  };

  const markAllAsRead = () => {
    notificationAPI.markAllAsRead().then(() => {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      window.dispatchEvent(new Event('notifications-updated'));
      toast.success('All marked as read');
    }).catch(() => toast.error('Failed'));
  };

  const deleteNotification = (id) => {
    notificationAPI.delete(id).then(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Deleted');
    }).catch(() => toast.error('Failed to delete'));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium text-sm whitespace-nowrap">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg flex items-center justify-center gap-2"><Bell size={24} /> No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-start gap-4 ${!n.isRead ? 'border-l-4 border-l-green-500' : ''}`}>
              <div className="text-2xl">{n.type === 'budget_alert' ? <AlertTriangle className="text-yellow-500" size={24} /> : n.type === 'debt_reminder' ? <ClipboardList className="text-blue-500" size={24} /> : <Info className="text-gray-500" size={24} />}</div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">{n.title}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{n.message}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                {!n.isRead && (
                  <button onClick={() => markAsRead(n.id)} className="text-green-600 hover:text-green-700 dark:text-green-400 text-sm">Mark read</button>
                )}
                <button onClick={() => deleteNotification(n.id)} className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
