import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const userTypeLabels = { PersonalFinance: 'Personal Finance User', Student: 'Student', Freelancer: 'Freelancer', Entrepreneur: 'Entrepreneur', SmallBusiness: 'Small Business', NGO: 'NGO' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUsers()
      .then(res => setUsers(res.data))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const toggleActive = (userId, currentStatus) => {
    adminAPI.toggleActive(userId).then((res) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: res.data.isActive } : u));
      toast.success(res.data.isActive ? 'User activated' : 'User deactivated');
    }).catch(() => toast.error('Operation failed'));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">
                  <Link to={`/admin/users/${user.id}`} className="font-medium text-green-600 hover:text-green-700 dark:text-green-400">{user.fullName}</Link>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{userTypeLabels[user.userType] || user.userType || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => toggleActive(user.id, user.isActive)} className={`text-sm font-medium ${user.isActive ? 'text-red-600 hover:text-red-800 dark:text-red-400' : 'text-green-600 hover:text-green-800 dark:text-green-400'}`}>
                    {user.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
