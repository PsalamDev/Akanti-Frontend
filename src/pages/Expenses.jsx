import { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Button, Input, Loading, PageHeader, EmptyState, Table, TableHead, Th, TableBody, TableRow, Td } from '../components/ui';
import toast from 'react-hot-toast';
import { TrendingDown } from 'lucide-react';

const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Shopping', 'Rent', 'Other'];

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', amount: '', date: '', category: 'Other' });

  const fetchExpenses = () => {
    expenseAPI.getAll()
      .then(res => setItems(res.data))
      .catch(() => toast.error('Failed to load expenses'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchExpenses(); }, []);

  const openAdd = () => { setForm({ title: '', description: '', amount: '', date: '', category: 'Other' }); setEditingItem(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ title: item.title, description: item.description || '', amount: item.amount, date: item.date?.split('T')[0] || '', category: item.category || 'Other' }); setEditingItem(item); setShowModal(true); };
  const openDelete = (item) => { setDeletingItem(item); setShowDeleteModal(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, amount: parseFloat(form.amount) };
    const action = editingItem ? expenseAPI.update(editingItem.id, payload) : expenseAPI.create(payload);
    action.then(() => {
      toast.success(editingItem ? 'Expense updated' : 'Expense added');
      setShowModal(false);
      fetchExpenses();
    }).catch(() => toast.error('Operation failed'));
  };

  const handleDelete = () => {
    expenseAPI.delete(deletingItem.id).then(() => {
      toast.success('Expense deleted');
      setShowDeleteModal(false);
      fetchExpenses();
    }).catch(() => toast.error('Delete failed'));
  };

  if (loading) return <Loading className="h-64" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Expenses" subtitle="Track and manage your spending" action={<Button variant="danger" onClick={openAdd}>+ Add Expense</Button>} />

      {items.length === 0 ? (
        <EmptyState icon={<TrendingDown size={24} />} title="No expenses recorded yet" action={<Button variant="link" onClick={openAdd}>Add your first expense</Button>} />
      ) : (
        <Table>
          <TableHead>
            <tr>
              <Th>Title</Th>
              <Th>Amount</Th>
              <Th className="hidden sm:table-cell">Category</Th>
              <Th>Date</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <Td className="text-gray-900 dark:text-white font-medium">{item.title}</Td>
                <Td className="text-red-600 dark:text-red-400 font-semibold">₦{item.amount.toLocaleString()}</Td>
                <Td className="hidden sm:table-cell">
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full text-xs">{item.category || 'Other'}</span>
                </Td>
                <Td className="text-gray-500 dark:text-gray-400 text-sm">{item.date ? new Date(item.date).toLocaleDateString() : '-'}</Td>
                <Td className="text-right space-x-2">
                  <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm">Edit</button>
                  <button onClick={() => openDelete(item)} className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm">Delete</button>
                </Td>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input type="number" placeholder="Amount" required step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input as="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </Input>
          <Input as="textarea" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="danger" type="submit">{editingItem ? 'Update' : 'Add'} Expense</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} title="Delete Expense" message={`Are you sure you want to delete "${deletingItem?.title}"?`} confirmText="Delete" type="danger" />
    </div>
  );
}
