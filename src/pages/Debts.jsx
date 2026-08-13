import { useState, useEffect } from 'react';
import { debtAPI } from '../services/api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Button, Input, Loading, PageHeader, EmptyState, Table, TableHead, Th, TableBody, TableRow, Td, Badge } from '../components/ui';
import toast from 'react-hot-toast';
import { ClipboardList, Bell, Clock } from 'lucide-react';

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
    const payload = { ...form, amount: parseFloat(form.amount), dueDate: form.dueDate || null, personEmail: form.personEmail || null, personName: form.personName || null };
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

  const statusTone = (status) => ({
    Pending: 'yellow',
    Paid: 'green',
    PartiallyPaid: 'blue',
    Overdue: 'red',
  }[status] || 'gray');

  const isOverdue = (item) => item.dueDate && new Date(item.dueDate) < new Date() && item.status === 'Pending';

  const displayItems = tab === 'upcoming' ? upcoming : items;

  if (loading) return <Loading className="h-64" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Debts" subtitle="Track money owed to you and money you owe" action={<Button variant="purple" onClick={openAdd}>+ Add Debt</Button>} />

      <div className="flex gap-2">
        <Button variant={tab === 'all' ? 'purple' : 'secondary'} onClick={() => setTab('all')} size="sm">
          <ClipboardList size={16} className="inline mr-1" /> All Debts
        </Button>
        <Button variant={tab === 'upcoming' ? 'purple' : 'secondary'} onClick={() => setTab('upcoming')} size="sm">
          <Clock size={16} className="inline mr-1" /> Upcoming (30 days)
        </Button>
      </div>

      {displayItems.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={24} />}
          title={tab === 'upcoming' ? 'No upcoming debts' : 'No debts tracked yet'}
          action={tab !== 'upcoming' && <Button variant="link" onClick={openAdd}>Add your first debt record</Button>}
        />
      ) : (
        <Table>
          <TableHead>
            <tr>
              <Th>Person</Th>
              <Th>Amount</Th>
              <Th className="hidden sm:table-cell">Paid</Th>
              <Th className="hidden md:table-cell">Type</Th>
              <Th>Status</Th>
              <Th className="hidden sm:table-cell">Due Date</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </TableHead>
          <TableBody>
            {displayItems.map((item) => {
              const status = isOverdue(item) ? 'Overdue' : item.status;
              return (
                <TableRow key={item.id}>
                  <Td>
                    <p className="font-medium text-gray-900 dark:text-white">{item.personName}</p>
                    {item.personEmail && <p className="text-sm text-gray-500 dark:text-gray-400">{item.personEmail}</p>}
                  </Td>
                  <Td className="font-semibold text-gray-900 dark:text-white">₦{item.amount.toLocaleString()}</Td>
                  <Td className="hidden sm:table-cell text-gray-500 dark:text-gray-400">₦{(item.amountPaid || 0).toLocaleString()}</Td>
                  <Td className="hidden md:table-cell text-gray-500 dark:text-gray-400">{item.type === 'Lent' ? 'Owed to me' : 'I owe'}</Td>
                  <Td><Badge tone={statusTone(status)}>{status}</Badge></Td>
                  <Td className="hidden sm:table-cell text-gray-500 dark:text-gray-400 text-sm">{item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}</Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      {item.type === 'Lent' && item.status !== 'Paid' && item.personEmail && (
                        <button onClick={() => handleReminder(item)} disabled={sendingReminder === item.id} className="text-orange-600 hover:text-orange-800 dark:text-orange-400 text-xs px-2 py-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20 disabled:opacity-50" title="Send Reminder">
                          <Bell size={14} className="inline" /> {sendingReminder === item.id ? '...' : 'Remind'}
                        </button>
                      )}
                      <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20">Edit</button>
                      <button onClick={() => openDelete(item)} className="text-red-600 hover:text-red-800 dark:text-red-400 text-xs px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
                    </div>
                  </Td>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit Debt' : 'Add Debt'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Person Name" required value={form.personName} onChange={(e) => setForm({ ...form, personName: e.target.value })} />
          <Input type="email" placeholder="Person Email (optional)" value={form.personEmail} onChange={(e) => setForm({ ...form, personEmail: e.target.value })} />
          <Input type="number" placeholder="Amount" required step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input as="select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="Lent">Owed to me</option>
            <option value="Borrowed">I owe</option>
          </Input>
          <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          <Input as="textarea" placeholder="Description" required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />

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
                <Input label="Remind me days before due date" type="number" min="1" max="30" value={form.reminderDaysBefore} onChange={(e) => setForm({ ...form, reminderDaysBefore: parseInt(e.target.value) || 3 })} />
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="purple" type="submit">{editingItem ? 'Update' : 'Add'} Debt</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} title="Delete Debt" message={`Are you sure you want to delete the debt record for "${deletingItem?.personName}"?`} confirmText="Delete" type="danger" />
    </div>
  );
}
