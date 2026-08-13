import { useState, useEffect } from 'react';
import { incomeAPI } from '../services/api';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import { Button, Input, Loading, PageHeader, EmptyState, Table, TableHead, Th, TableBody, TableRow, Td } from '../components/ui';
import toast from 'react-hot-toast';
import { CircleDollarSign } from 'lucide-react';

const emptyForm = { title: '', amount: '', date: '', description: '', frequency: 'OneTime' };

export default function Income() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchIncome = () => {
    incomeAPI.getAll()
      .then(res => setItems(res.data))
      .catch(() => toast.error('Failed to load income'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchIncome(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditingItem(null); setShowModal(true); };
  const openEdit = (item) => { setForm({ title: item.title, amount: item.amount, date: item.date?.split('T')[0] || '', description: item.description || '', frequency: item.frequency || 'OneTime' }); setEditingItem(item); setShowModal(true); };
  const openDelete = (item) => { setDeletingItem(item); setShowDeleteModal(true); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, amount: parseFloat(form.amount) };
    const action = editingItem ? incomeAPI.update(editingItem.id, payload) : incomeAPI.create(payload);
    action.then(() => {
      toast.success(editingItem ? 'Income updated' : 'Income added');
      setShowModal(false);
      fetchIncome();
    }).catch(() => toast.error('Operation failed'));
  };

  const handleDelete = () => {
    incomeAPI.delete(deletingItem.id).then(() => {
      toast.success('Income deleted');
      setShowDeleteModal(false);
      fetchIncome();
    }).catch(() => toast.error('Delete failed'));
  };

  if (loading) return <Loading className="h-64" />;

  return (
    <div className="space-y-6">
      <PageHeader title="Income" subtitle="Track all your income sources" action={<Button onClick={openAdd}>+ Add Income</Button>} />

      {items.length === 0 ? (
        <EmptyState icon={<CircleDollarSign size={24} />} title="No income records yet" action={<Button variant="link" onClick={openAdd}>Add your first income</Button>} />
      ) : (
        <Table>
          <TableHead>
            <tr>
              <Th>Title</Th>
              <Th>Amount</Th>
              <Th className="hidden sm:table-cell">Description</Th>
              <Th>Date</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <Td className="text-gray-900 dark:text-white font-medium">{item.title}</Td>
                <Td className="text-green-600 dark:text-green-400 font-semibold">₦{item.amount.toLocaleString()}</Td>
                <Td className="hidden sm:table-cell text-gray-500 dark:text-gray-400">{item.description || '-'}</Td>
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Edit Income' : 'Add Income'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input type="number" placeholder="Amount" required step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <Input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input as="textarea" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">{editingItem ? 'Update' : 'Add'} Income</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} title="Delete Income" message={`Are you sure you want to delete "${deletingItem?.title}"?`} confirmText="Delete" type="danger" />
    </div>
  );
}
