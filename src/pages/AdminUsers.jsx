import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const userTypeLabels = { PersonalFinance: 'Personal Finance User', Student: 'Student', Freelancer: 'Freelancer', Entrepreneur: 'Entrepreneur', SmallBusiness: 'Small Business', NGO: 'NGO' };

const PAGE_SIZE = 25;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    adminAPI.getUsers({ page, pageSize: PAGE_SIZE })
      .then(res => {
        setUsers(res.data.items || []);
        setTotalCount(res.data.totalCount || 0);
        setTotalPages(Math.max(res.data.totalPages || 1, 1));
      })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, [page]);

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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {totalCount === 0
            ? 'No users found'
            : `Showing ${(page - 1) * PAGE_SIZE + 1}\u2013${Math.min(page * PAGE_SIZE, totalCount)} of ${totalCount} users`}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page <= 1 || loading}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page >= totalPages || loading}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
