import { useState, useEffect } from 'react';
import budgetService from '../services/budgetService';
import categoryService from '../services/categoryService';
import analyticsService from '../services/analyticsService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency, getCurrentMonthYear, getMonthName } from '../utils/helpers';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import './Budgets.css';

export default function Budgets() {
  const { month: currentMonth, year: currentYear } = getCurrentMonthYear();
  const [budgetUsage, setBudgetUsage] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ category_id: '', amount: '', month: currentMonth, year: currentYear });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { fetchData(); }, [month, year]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usageRes, catRes] = await Promise.all([
        analyticsService.getBudgetUsage(month, year),
        categoryService.getAll('expense'),
      ]);
      setBudgetUsage(usageRes.data?.budgetUsage || []);
      setCategories(catRes.data?.categories || []);
    } catch {
      toast.error('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setForm({ category_id: '', amount: '', month, year });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (b) => {
    setForm({ category_id: b.category?.id || '', amount: b.budgetAmount, month, year });
    setEditingId(b.id);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.category_id || !form.amount || parseFloat(form.amount) <= 0) {
      toast.error('Please fill all fields with valid values');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await budgetService.update(editingId, { ...form, amount: parseFloat(form.amount), month: parseInt(form.month), year: parseInt(form.year) });
        toast.success('Budget updated');
      } else {
        await budgetService.create({ ...form, amount: parseFloat(form.amount), month: parseInt(form.month), year: parseInt(form.year) });
        toast.success('Budget created');
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await budgetService.delete(deleteId);
      toast.success('Budget deleted');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const totalBudget = budgetUsage.reduce((s, b) => s + b.budgetAmount, 0);
  const totalSpent = budgetUsage.reduce((s, b) => s + b.spent, 0);

  return (
    <div className="budgets-page">
      <div className="page-title">
        <h1>Budgets</h1>
        <button className="btn btn-primary" onClick={openAdd}><HiPlus /> New Budget</button>
      </div>

      <div className="budget-period">
        <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>{getMonthName(i + 1)}</option>
          ))}
        </select>
        <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
          {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {budgetUsage.length > 0 && (
        <div className="budget-summary-bar">
          <div>
            <span className="bs-label">Total Budget</span>
            <span className="bs-value">{formatCurrency(totalBudget)}</span>
          </div>
          <div>
            <span className="bs-label">Total Spent</span>
            <span className="bs-value">{formatCurrency(totalSpent)}</span>
          </div>
          <div>
            <span className="bs-label">Remaining</span>
            <span className="bs-value">{formatCurrency(totalBudget - totalSpent)}</span>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading budgets..." />
      ) : budgetUsage.length === 0 ? (
        <EmptyState icon="🎯" title="No budgets set" message="Create monthly budgets to stay on top of your spending." action={{ label: '+ Create Budget', onClick: openAdd }} />
      ) : (
        <div className="budgets-grid">
          {budgetUsage.map((b) => (
            <div className={`budget-card status-${b.status}`} key={b.id}>
              <div className="budget-card-header">
                <div className="budget-cat">
                  <span className="budget-cat-icon">{b.category?.icon || '📦'}</span>
                  <span className="budget-cat-name">{b.category?.name || 'Unknown'}</span>
                </div>
                <div className="budget-card-actions">
                  <button className="icon-btn" onClick={() => openEdit(b)}><HiPencil /></button>
                  <button className="icon-btn icon-btn-danger" onClick={() => setDeleteId(b.id)}><HiTrash /></button>
                </div>
              </div>
              <ProgressBar value={b.spent} max={b.budgetAmount} />
              <div className="budget-card-stats">
                <div><span className="stat-label">Budget</span><span className="stat-value">{formatCurrency(b.budgetAmount)}</span></div>
                <div><span className="stat-label">Spent</span><span className="stat-value">{formatCurrency(b.spent)}</span></div>
                <div><span className="stat-label">Left</span><span className={`stat-value ${b.remaining < 0 ? 'amount-expense' : ''}`}>{formatCurrency(b.remaining)}</span></div>
              </div>
              {b.status === 'exceeded' && <div className="budget-alert alert-danger">⚠️ Budget exceeded</div>}
              {b.status === 'critical' && <div className="budget-alert alert-warning">⚠️ Almost used up</div>}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Budget' : 'New Budget'} size="small">
        <form className="budget-form" onSubmit={handleSave}>
          <div className="form-group">
            <label>Category</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Budget Amount (₹)</label>
            <input type="number" min="1" step="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="2000" required />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Budget" message="Are you sure you want to delete this budget?" />
    </div>
  );
}
