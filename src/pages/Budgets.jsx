import { useState, useEffect } from 'react';
import { budgetAPI } from '../services/api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Button, Input, Loading, PageHeader, EmptyState, Card } from '../components/ui';
import toast from 'react-hot-toast';
import { Target } from 'lucide-react';

export default function Budgets() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [form, setForm] = useState({ name: '', amount: '', category: '', period: 'Monthly', startDate: '', endDate: '' });

  const fetchBudgets = () => {
    budgetAPI.getAll()
      .then(res => setItems(res.data))
      .catch(() => toast.error('Failed to load budgets'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBudgets(); }, []);

  const openAdd = () => { setForm({ name: '', amount: '', category: '', period: 'Monthly', startDate: '', endDate: '' }); setEditingItem(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ name: item.name, amount: item.amount, category: item.category || '', period: item.period || 'Monthly', startDate: item.startDate?.split('T')[0] || '', endDate: item.endDate?.split('T')[0] || '' }); setEditingItem(item); setShowModal(true); };
  const openDelete = (item) => { setDeletingItem(item); setShowDeleteModal(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, amount: parseFloat(form.amount) };
    const action = editingItem ? budgetAPI.update(editingItem.id, payload) : budgetAPI.create(payload);
    action.then(() => {
      toast.success(editingItem ? 'Budget updated' : 'Budget created');
      setShowModal(false);
      fetchBudgets();
    }).catch(() => toast.error('Operation failed'));
  };

  const handleDelete = () => {
    budgetAPI.delete(deletingItem.id).then(() => {
      toast.success('Budget deleted');
      setShowDeleteModal(false);
      fetchBudgets();
    }).catch(() => toast.error('Delete failed'));
  };

  if (loading) return <Loading className="h-64" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Budgets" subtitle="Set and track your spending limits" action={<Button variant="info" onClick={openAdd}>+ Create Budget</Button>} />

      {items.length === 0 ? (
        <EmptyState icon={<Target size={24} />} title="No budgets yet" action={<Button variant="link" onClick={openAdd}>Create your first budget</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.category || 'General'} • {item.period || 'monthly'}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm px-2 py-1">Edit</button>
                  <button onClick={() => openDelete(item)} className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm px-2 py-1">Delete</button>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₦{item.amount.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Budget limit</p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit Budget' : 'Create Budget'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Budget Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input type="number" placeholder="Amount" required step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input placeholder="Category (optional)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input as="select" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </Input>
          <Input label="Start Date" type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <Input label="End Date" type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="info" type="submit">{editingItem ? 'Update' : 'Create'} Budget</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} title="Delete Budget" message={`Are you sure you want to delete "${deletingItem?.name}"?`} confirmText="Delete" type="danger" />
    </div>
  );
}
