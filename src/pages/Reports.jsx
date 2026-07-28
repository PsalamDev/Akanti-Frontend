import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { incomeAPI, expenseAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';

export default function Reports() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('summary');

  useEffect(() => {
    Promise.all([incomeAPI.getAll(), expenseAPI.getAll()])
      .then(([inc, exp]) => { setIncome(inc.data); setExpenses(exp.data); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const monthlyData = () => {
    const months = {};
    income.forEach(i => {
      const key = new Date(i.date).toLocaleDateString('en-US', { month: 'short' });
      months[key] = months[key] || { name: key, income: 0, expenses: 0 };
      months[key].income += i.amount;
    });
    expenses.forEach(e => {
      const key = new Date(e.date).toLocaleDateString('en-US', { month: 'short' });
      months[key] = months[key] || { name: key, income: 0, expenses: 0 };
      months[key].expenses += e.amount;
    });
    return Object.values(months).slice(-6);
  };

  const downloadCSV = () => {
    const rows = [['Type', 'Description', 'Amount', 'Category', 'Date']];
    income.forEach(i => rows.push(['Income', i.source, i.amount, i.category || '', new Date(i.date).toLocaleDateString()]));
    expenses.forEach(e => rows.push(['Expense', e.description, e.amount, e.category || '', new Date(e.date).toLocaleDateString()]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'akanti-report.csv'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded');
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Analyze your financial data</p>
        </div>
        <button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
          <Download size={16} /> Download CSV
        </button>
      </div>

      <div className="flex gap-2">
        {['summary', 'trends'].map(type => (
          <button key={type} onClick={() => setReportType(type)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${reportType === type ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
            {type}
          </button>
        ))}
      </div>

      {reportType === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Income Summary</h2>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">₦{totalIncome.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{income.length} transactions</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Expense Summary</h2>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">₦{totalExpenses.toLocaleString()}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{expenses.length} transactions</p>
          </div>
        </div>
      )}

      {reportType === 'trends' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends</h2>
          {monthlyData().length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip />
                <Bar dataKey="income" fill="#22c55e" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
}
