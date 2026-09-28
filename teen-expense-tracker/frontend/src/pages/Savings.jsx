import { useState, useEffect } from 'react';
import savingsGoalService from '../services/savingsGoalService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency, formatDate, toInputDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash, HiCash } from 'react-icons/hi';
import './Savings.css';

export default function Savings() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', target_amount: '', current_amount: '0', deadline: '' });
  const [saving, setSaving] = useState(false);

  const [addMoneyModal, setAddMoneyModal] = useState(null);
  const [addAmount, setAddAmount] = useState('');

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await savingsGoalService.getAll();
      setGoals(res.data?.goals || []);
    } catch {
      toast.error('Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ name: '', target_amount: '', current_amount: '0', deadline: '' });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (g) => {
    setForm({
      name: g.name,
      target_amount: g.target_amount,
      current_amount: g.current_amount,
      deadline: g.deadline ? toInputDate(g.deadline) : '',
    });
    setEditingId(g.id);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.target_amount || parseFloat(form.target_amount) <= 0) {
      toast.error('Please fill in name and target amount');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        target_amount: parseFloat(form.target_amount),
        current_amount: parseFloat(form.current_amount) || 0,
        deadline: form.deadline || undefined,
      };
      if (editingId) {
        await savingsGoalService.update(editingId, payload);
        toast.success('Goal updated');
      } else {
        await savingsGoalService.create(payload);
        toast.success('Goal created!');
      }
      setModalOpen(false);
      fetchGoals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    try {
      await savingsGoalService.addMoney(addMoneyModal, parseFloat(addAmount));
      toast.success(`₹${addAmount} added to savings!`);
      setAddMoneyModal(null);
      setAddAmount('');
      fetchGoals();
    } catch {
      toast.error('Failed to add money');
    }
  };

  const handleDelete = async () => {
    try {
      await savingsGoalService.delete(deleteId);
      toast.success('Goal deleted');
      setDeleteId(null);
      fetchGoals();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="savings-page">
      <div className="page-title">
        <h1>Savings Goals</h1>
        <button className="btn btn-primary" onClick={openAdd}><HiPlus /> New Goal</button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading savings goals..." />
      ) : goals.length === 0 ? (
        <EmptyState icon="🏆" title="No savings goals yet" message="Set a goal — save for headphones, a trip, or anything you want!" action={{ label: '+ Create Goal', onClick: openAdd }} />
      ) : (
        <div className="goals-grid">
          {goals.map((g) => (
            <div className="goal-card" key={g.id}>
              <div className="goal-header">
                <h3>{g.name}</h3>
                <div className="goal-actions">
                  <button className="icon-btn" onClick={() => { setAddMoneyModal(g.id); setAddAmount(''); }} title="Add money"><HiCash /></button>
                  <button className="icon-btn" onClick={() => openEdit(g)} title="Edit"><HiPencil /></button>
                  <button className="icon-btn icon-btn-danger" onClick={() => setDeleteId(g.id)} title="Delete"><HiTrash /></button>
                </div>
              </div>
              <ProgressBar value={parseFloat(g.current_amount)} max={parseFloat(g.target_amount)} color="purple" />
              <div className="goal-stats">
                <div><span className="stat-label">Saved</span><span className="stat-value">{formatCurrency(g.current_amount)}</span></div>
                <div><span className="stat-label">Target</span><span className="stat-value">{formatCurrency(g.target_amount)}</span></div>
                <div><span className="stat-label">Remaining</span><span className="stat-value">{formatCurrency(g.remaining)}</span></div>
              </div>
              {g.deadline && (
                <div className="goal-deadline">📅 Deadline: {formatDate(g.deadline)}</div>
              )}
              {g.progress >= 100 && <div className="goal-complete">🎉 Goal reached!</div>}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Goal' : 'New Savings Goal'} size="small">
        <form className="goal-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Goal Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. New Headphones" required />
          </div>
          <div className="form-group">
            <label>Target Amount (₹)</label>
            <input type="number" min="1" value={form.target_amount} onChange={(e) => setForm({ ...form, target_amount: e.target.value })} placeholder="5000" required />
          </div>
          <div className="form-group">
            <label>Currently Saved (₹)</label>
            <input type="number" min="0" value={form.current_amount} onChange={(e) => setForm({ ...form, current_amount: e.target.value })} placeholder="0" />
          </div>
          <div className="form-group">
            <label>Deadline (optional)</label>
            <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      {/* Add Money Modal */}
      <Modal isOpen={!!addMoneyModal} onClose={() => setAddMoneyModal(null)} title="Add Money to Goal" size="small">
        <div className="add-money-form">
          <div className="form-group">
            <label>Amount (₹)</label>
            <input type="number" min="1" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} placeholder="500" autoFocus />
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={() => setAddMoneyModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddMoney}>Add Money</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Goal" message="Are you sure you want to delete this savings goal?" />
    </div>
  );
}
