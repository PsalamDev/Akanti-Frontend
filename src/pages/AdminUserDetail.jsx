import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';

const userTypeLabels = { PersonalFinance: 'Personal Finance User', Student: 'Student', Freelancer: 'Freelancer', Entrepreneur: 'Entrepreneur', SmallBusiness: 'Small Business', NGO: 'NGO' };

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getUserDetail(id)
      .then(res => setUser(res.data))
      .catch(() => toast.error('Failed to load user'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleActive = () => {
    adminAPI.toggleActive(id).then((res) => {
      setUser(prev => ({ ...prev, isActive: res.data.isActive }));
      toast.success(res.data.isActive ? 'User activated' : 'User deactivated');
    }).catch(() => toast.error('Operation failed'));
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;
  if (!user) return <div className="text-center py-12 text-gray-500 dark:text-gray-400">User not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/admin/users" className="text-green-600 hover:text-green-700 dark:text-green-400 text-sm font-medium">← Back to Users</Link>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.fullName}</h1>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Type: {userTypeLabels[user.userType] || user.userType || 'Not set'} • Joined {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <button onClick={toggleActive} className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${user.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300'}`}>
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Income</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">₦{(user.totalIncome || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">₦{(user.totalExpenses || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₦{((user.totalIncome || 0) - (user.totalExpenses || 0)).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
