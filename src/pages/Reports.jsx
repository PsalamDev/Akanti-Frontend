import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { incomeAPI, expenseAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Download, ChevronDown } from 'lucide-react';

export default function Reports() {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('summary');
  const [showDownload, setShowDownload] = useState(false);

  useEffect(() => {
    Promise.all([incomeAPI.getAll(), expenseAPI.getAll()])
      .then(([inc, exp]) => { setIncome(inc.data); setExpenses(exp.data); })
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const safeDate = (d) => d ? new Date(d) : null;

  const getPeriodKey = (item) => {
    const d = safeDate(item.date);
    if (!d) return 'Unknown';
    if (reportType === 'daily') return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
    if (reportType === 'weekly') {
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) + ' wk';
    }
    if (reportType === 'annual') return `'${d.getFullYear().toString().slice(-2)}`;
    return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  };

  const sortKey = (item) => safeDate(item.date)?.getTime() || 0;

  const periodData = () => {
    const groups = {};
    const all = [...income.map(i => ({ ...i, type: 'income' })), ...expenses.map(e => ({ ...e, type: 'expense' }))];
    all.sort((a, b) => sortKey(a) - sortKey(b));
    all.forEach(item => {
      const key = getPeriodKey(item) || 'Unknown';
      if (!groups[key]) groups[key] = { name: key, income: 0, expenses: 0 };
      groups[key][item.type === 'income' ? 'income' : 'expenses'] += item.amount;
    });
    return Object.values(groups);
  };

  const downloadCSV = (period) => {
    const rows = [['Period', 'Income', 'Expenses']];
    const all = [...income.map(i => ({ ...i, type: 'income' })), ...expenses.map(e => ({ ...e, type: 'expense' }))];
    const groups = {};
    all.forEach(item => {
      const d = item.date ? new Date(item.date) : null;
      if (!d) return;
      let key;
      if (period === 'daily') key = d.toLocaleDateString();
      else if (period === 'weekly') { const s = new Date(d); s.setDate(d.getDate() - d.getDay()); key = s.toLocaleDateString(); }
      else if (period === 'annual') key = d.getFullYear().toString();
      else key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!groups[key]) groups[key] = { name: key, income: 0, expenses: 0 };
      groups[key][item.type === 'income' ? 'income' : 'expenses'] += item.amount;
    });
    Object.values(groups).forEach(d => rows.push([d.name, d.income.toFixed(2), d.expenses.toFixed(2)]));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `akanti-${period}-report.csv`; a.click();
    URL.revokeObjectURL(url);
    setShowDownload(false);
    toast.success(`${period} report downloaded`);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Analyze your financial data</p>
        </div>
        <div className="relative">
          <button onClick={() => setShowDownload(!showDownload)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
            <Download size={16} /> Download CSV <ChevronDown size={16} />
          </button>
          {showDownload && (
            <div className="fixed inset-0 z-10" onClick={() => setShowDownload(false)}></div>
          )}
          {showDownload && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
              {['daily', 'weekly', 'monthly', 'annual'].map(p => (
                <button key={p} onClick={() => downloadCSV(p)} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 capitalize first:rounded-t-lg last:rounded-b-lg">
                  {p} Report
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['summary', 'daily', 'weekly', 'monthly', 'annual'].map(type => (
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

      {reportType !== 'summary' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">{reportType} Trends</h2>
          {periodData().length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={periodData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                <YAxis stroke="#9ca3af" tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(value) => `₦${Number(value).toLocaleString()}`} />
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
