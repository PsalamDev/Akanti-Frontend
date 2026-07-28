import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { incomeAPI, expenseAPI, budgetAPI, debtAPI } from '../services/api';
import StatCard from '../components/StatCard';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { CircleDollarSign, TrendingUp, TrendingDown, Target, Bot } from 'lucide-react';

export default function Dashboard() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      incomeAPI.getAll(),
      expenseAPI.getAll(),
      budgetAPI.getAll(),
      debtAPI.getAll()
    ]).then(([inc, exp, bud, deb]) => {
      setIncome(inc.data);
      setExpenses(exp.data);
      setBudgets(bud.data);
      setDebts(deb.data);
    }).catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpenses;
  const activeBudgets = budgets.length;

  const monthlyTrends = useMemo(() => {
    const months = {};
    income.forEach(item => {
      const key = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!months[key]) months[key] = { month: key, income: 0, expenses: 0 };
      months[key].income += item.amount;
    });
    expenses.forEach(item => {
      const key = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!months[key]) months[key] = { month: key, income: 0, expenses: 0 };
      months[key].expenses += item.amount;
    });
    return Object.values(months).sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    });
  }, [income, expenses]);

  const categoryBreakdown = useMemo(() => {
    const cats = {};
    expenses.forEach(item => {
      const cat = item.categoryName || item.category || 'Uncategorized';
      if (!cats[cat]) cats[cat] = 0;
      cats[cat] += item.amount;
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [expenses]);

  const incomeVsExpense = useMemo(() => {
    const months = {};
    income.forEach(item => {
      const key = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!months[key]) months[key] = { month: key, income: 0, expenses: 0 };
      months[key].income += item.amount;
    });
    expenses.forEach(item => {
      const key = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!months[key]) months[key] = { month: key, income: 0, expenses: 0 };
      months[key].expenses += item.amount;
    });
    return Object.values(months).sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA - dateB;
    });
  }, [income, expenses]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here's your financial overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Balance" value={`₦${balance.toLocaleString()}`} icon={<CircleDollarSign size={24} />} color={balance >= 0 ? 'green' : 'red'} />
        <StatCard title="Total Income" value={`₦${totalIncome.toLocaleString()}`} icon={<TrendingUp size={24} />} color="green" />
        <StatCard title="Total Expenses" value={`₦${totalExpenses.toLocaleString()}`} icon={<TrendingDown size={24} />} color="red" />
        <StatCard title="Active Budgets" value={activeBudgets} icon={<Target size={24} />} color="blue" />
      </div>

      {/* Income vs Expenses Trend Chart */}
      {monthlyTrends.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income vs Expenses Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Expenses" fill="#dc2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top Spending Categories */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Spending Categories</h2>
          <div className="space-y-3">
            {categoryBreakdown.map((cat, i) => {
              const maxVal = categoryBreakdown[0]?.value || 1;
              const pct = (cat.value / maxVal) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{cat.name}</span>
                    <span className="text-gray-500 dark:text-gray-400 font-medium">₦{cat.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Income</h2>
          {income.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No income records yet. <Link to="/dashboard/income" className="text-green-600 hover:underline">Add one</Link></p>
          ) : (
            <div className="space-y-3">
              {income.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-semibold">+₦{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No expenses recorded yet. <Link to="/dashboard/expenses" className="text-green-600 hover:underline">Add one</Link></p>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.categoryName || item.category || '-'} • {new Date(item.date).toLocaleDateString()}</p>
                  </div>
                  <span className="text-red-600 dark:text-red-400 font-semibold">-₦{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating AI Button */}
      <button
        onClick={() => navigate('/dashboard/ai-assistant')}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg transition-all hover:scale-105"
      >
        <Bot size={22} />
        <span className="font-medium hidden sm:inline">Chat with AI</span>
      </button>
    </div>
  );
}
