import { useState, useEffect, useCallback } from 'react';
import transactionService from '../services/transactionService';
import categoryService from '../services/categoryService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatCurrency, formatDate, toInputDate } from '../utils/helpers';
import toast from 'react-hot-toast';
import { HiSearch, HiFilter, HiPencil, HiTrash, HiPlus } from 'react-icons/hi';
import './Transactions.css';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Debit Card', 'Bank Transfer', 'Other'];

const emptyForm = {
  type: 'expense',
  amount: '',
  category_id: '',
  description: '',
  transaction_date: new Date().toISOString().split('T')[0],
  payment_method: 'Cash',
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', category_id: '', search: '', startDate: '', endDate: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [txRes, catRes] = await Promise.all([
        transactionService.getAll(filters),
        categoryService.getAll(),
      ]);
      setTransactions(txRes.data?.data || []);
      setCategories(catRes.data?.categories || []);
    } catch {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredCategories = form.type
    ? categories.filter((c) => c.type === form.type)
    : categories;

  const validateForm = () => {
    const errs = {};
    if (!form.type) errs.type = 'Required';
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Must be a positive number';
    if (!form.category_id) errs.category_id = 'Select a category';
    if (!form.transaction_date) errs.transaction_date = 'Date is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openAdd = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setForm({
      type: t.type,
      amount: t.amount,
      category_id: t.category_id,
      description: t.description || '',
      transaction_date: toInputDate(t.transaction_date),
      payment_method: t.payment_method || 'Cash',
    });
    setEditingId(t.id);
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    try {
      if (editingId) {
        await transactionService.update(editingId, {
          ...form,
          amount: parseFloat(form.amount),
        });
        toast.success('Transaction updated');
      } else {
        await transactionService.create({
          ...form,
          amount: parseFloat(form.amount),
        });
        toast.success('Transaction added');
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
      await transactionService.delete(deleteId);
      toast.success('Transaction deleted');
      setDeleteId(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="transactions-page">
      <div className="page-title">
        <h1>Transactions</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <HiPlus /> Add Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <HiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowFilters(!showFilters)}>
          <HiFilter /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-row">
            <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={filters.category_id} onChange={(e) => setFilters({ ...filters, category_id: e.target.value })}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name} ({c.type})</option>
              ))}
            </select>
            <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} placeholder="From" />
            <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} placeholder="To" />
            <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ type: '', category_id: '', search: '', startDate: '', endDate: '' })}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Transactions List */}
      {loading ? (
        <LoadingSpinner message="Loading transactions..." />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No transactions found"
          message="Add your first expense or income to start tracking your money."
          action={{ label: '+ Add Transaction', onClick: openAdd }}
        />
      ) : (
        <div className="transactions-table-wrap">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id}>
                  <td className="td-date">{formatDate(t.transaction_date)}</td>
                  <td>
                    <span className="category-badge">
                      {t.categories?.icon || '📦'} {t.categories?.name || 'Other'}
                    </span>
                  </td>
                  <td className="td-desc">{t.description || '—'}</td>
                  <td className="td-method">{t.payment_method || 'Cash'}</td>
                  <td className={`td-amount ${t.type === 'income' ? 'amount-income' : 'amount-expense'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                  </td>
                  <td className="td-actions">
                    <button className="icon-btn" onClick={() => openEdit(t)} aria-label="Edit"><HiPencil /></button>
                    <button className="icon-btn icon-btn-danger" onClick={() => setDeleteId(t.id)} aria-label="Delete"><HiTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Transaction' : 'Add Transaction'}>
        <form className="tx-form" onSubmit={handleSave} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <div className="type-toggle">
                <button type="button" className={`toggle-btn ${form.type === 'expense' ? 'active-expense' : ''}`} onClick={() => setForm({ ...form, type: 'expense', category_id: '' })}>Expense</button>
                <button type="button" className={`toggle-btn ${form.type === 'income' ? 'active-income' : ''}`} onClick={() => setForm({ ...form, type: 'income', category_id: '' })}>Income</button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="tx-amount">Amount (₹)</label>
              <input id="tx-amount" type="number" min="0" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={formErrors.amount ? 'input-error' : ''} placeholder="0.00" />
              {formErrors.amount && <span className="error-text">{formErrors.amount}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tx-category">Category</label>
              <select id="tx-category" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={formErrors.category_id ? 'input-error' : ''}>
                <option value="">Select category</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
              {formErrors.category_id && <span className="error-text">{formErrors.category_id}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="tx-date">Date</label>
              <input id="tx-date" type="date" value={form.transaction_date} onChange={(e) => setForm({ ...form, transaction_date: e.target.value })} className={formErrors.transaction_date ? 'input-error' : ''} />
              {formErrors.transaction_date && <span className="error-text">{formErrors.transaction_date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tx-desc">Description</label>
            <input id="tx-desc" type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What was this for?" maxLength={255} />
          </div>

          <div className="form-group">
            <label htmlFor="tx-method">Payment Method</label>
            <select id="tx-method" value={form.payment_method} onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
      />
    </div>
  );
}
