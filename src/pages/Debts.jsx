import { useState, useEffect } from 'react';
import { debtAPI } from '../services/api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import { ClipboardList, Bell, Clock, AlertTriangle } from 'lucide-react';

export default function Debts() {
  const [items, setItems] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [sendingReminder, setSendingReminder] = useState(null);
  const [form, setForm] = useState({ personName: '', personEmail: '', amount: '', type: 'Lent', description: '', dueDate: '', hasReminder: false, reminderDaysBefore: 3 });

  const fetchDebts = () => {
    debtAPI.getAll()
      .then(res => setItems(res.data))
      .catch(() => toast.error('Failed to load debts'))
      .finally(() => setLoading(false));
  };

  const fetchUpcoming = () => {
    debtAPI.getUpcoming({ days: 30 })
      .then(res => setUpcoming(res.data))
      .catch(() => {});
  };

  useEffect(() => { fetchDebts(); fetchUpcoming(); }, []);

  const openAdd = () => { setForm({ personName: '', personEmail: '', amount: '', type: 'Lent', description: '', dueDate: '', hasReminder: false, reminderDaysBefore: 3 }); setEditingItem(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ personName: item.personName || '', personEmail: item.personEmail || '', amount: item.amount, type: item.type, description: item.description || '', dueDate: item.dueDate?.split('T')[0] || '', hasReminder: item.hasReminder || false, reminderDaysBefore: item.reminderDaysBefore || 3 }); setEditingItem(item); setShowModal(true); };
  const openDelete = (item) => { setDeletingItem(item); setShowDeleteModal(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, amount: parseFloat(form.amount) };
    const action = editingItem ? debtAPI.update(editingItem.id, payload) : debtAPI.create(payload);
    action.then(() => {
      toast.success(editingItem ? 'Debt updated' : 'Debt added');
      setShowModal(false);
      fetchDebts();
      fetchUpcoming();
    }).catch(() => toast.error('Operation failed'));
  };

  const handleDelete = () => {
    debtAPI.delete(deletingItem.id).then(() => {
      toast.success('Debt deleted');
      setShowDeleteModal(false);
      fetchDebts();
      fetchUpcoming();
    }).catch(() => toast.error('Delete failed'));
  };

  const handleReminder = (item) => {
    setSendingReminder(item.id);
    debtAPI.sendReminder(item.id).then(() => {
      toast.success('Reminder sent');
    }).catch(() => toast.error('Failed to send reminder'))
      .finally(() => setSendingReminder(null));
  };

  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    PartiallyPaid: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    Overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  const isOverdue = (item) => item.dueDate && new Date(item.dueDate) < new Date() && item.status === 'Pending';

  const displayItems = tab === 'upcoming' ? upcoming : items;

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Debts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track money owed to you and money you owe</p>
        </div>
        <button onClick={openAdd} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
          + Add Debt
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('all')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
          <ClipboardList size={16} /> All Debts
        </button>
        <button onClick={() => setTab('upcoming')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'upcoming' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
          <Clock size={16} /> Upcoming (30 days)
        </button>
      </div>

      {displayItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg flex items-center justify-center gap-2"><ClipboardList size={24} /> {tab === 'upcoming' ? 'No upcoming debts' : 'No debts tracked yet'}</p>
          {tab !== 'upcoming' && <button onClick={openAdd} className="mt-4 text-green-600 hover:underline font-medium">Add your first debt record</button>}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full min-w-[650px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Person</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Amount</th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Paid</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Type</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Due Date</th>
                <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayItems.map((item) => {
                const status = isOverdue(item) ? 'Overdue' : item.status;
                return (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-medium text-gray-900 dark:text-white">{item.personName}</p>
                      {item.personEmail && <p className="text-sm text-gray-500 dark:text-gray-400">{item.personEmail}</p>}
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-semibold text-gray-900 dark:text-white">₦{item.amount.toLocaleString()}</td>
                    <td className="hidden sm:table-cell px-6 py-4 text-gray-500 dark:text-gray-400">₦{(item.amountPaid || 0).toLocaleString()}</td>
                    <td className="hidden md:table-cell px-6 py-4 text-gray-500 dark:text-gray-400">{item.type === 'Lent' ? 'Owed to me' : 'I owe'}</td>
                    <td className="px-4 sm:px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.Pending}`}>{status}</span></td>
                    <td className="hidden sm:table-cell px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}</td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        {item.type === 'Lent' && item.status !== 'Paid' && item.personEmail && (
                          <button onClick={() => handleReminder(item)} disabled={sendingReminder === item.id} className="text-orange-600 hover:text-orange-800 dark:text-orange-400 text-xs px-2 py-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50" title="Send Reminder">
                            <Bell size={14} className="inline" /> {sendingReminder === item.id ? '...' : 'Remind'}
                          </button>
                        )}
                        <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">Edit</button>
                        <button onClick={() => openDelete(item)} className="text-red-600 hover:text-red-800 dark:text-red-400 text-xs px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Debt Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit Debt' : 'Add Debt'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Person Name" required value={form.personName} onChange={(e) => setForm({ ...form, personName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          <input type="email" placeholder="Person Email (optional)" value={form.personEmail} onChange={(e) => setForm({ ...form, personEmail: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          <input type="number" placeholder="Amount" required step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent">
            <option value="Lent">Owed to me</option>
            <option value="Borrowed">I owe</option>
          </select>
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          <textarea placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent" rows={3} />

          {/* Reminder Settings */}
          <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Reminder Settings</p>
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`relative w-10 h-5 rounded-full transition-colors ${form.hasReminder ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`} onClick={() => setForm({ ...form, hasReminder: !form.hasReminder })}>
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${form.hasReminder ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Enable email reminders</span>
            </label>
            {form.hasReminder && (
              <div className="mt-3">
                <label className="text-sm text-gray-500 dark:text-gray-400">Remind me days before due date</label>
                <input type="number" min="1" max="30" value={form.reminderDaysBefore} onChange={(e) => setForm({ ...form, reminderDaysBefore: parseInt(e.target.value) || 3 })} className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">{editingItem ? 'Update' : 'Add'} Debt</button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} title="Delete Debt" message={`Are you sure you want to delete the debt record for "${deletingItem?.personName}"?`} confirmText="Delete" type="danger" />
    </div>
  );
}
