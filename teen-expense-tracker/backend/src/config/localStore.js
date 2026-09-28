const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// File to persist dev database
const DATA_FILE = path.resolve(__dirname, '../../../database/local_dev_store.json');

const INITIAL_CATEGORIES = [
  { id: '11111111-0001-4000-8000-000000000001', user_id: null, name: 'Food', type: 'expense', icon: '🍔' },
  { id: '11111111-0002-4000-8000-000000000002', user_id: null, name: 'Snacks', type: 'expense', icon: '🍿' },
  { id: '11111111-0003-4000-8000-000000000003', user_id: null, name: 'Transportation', type: 'expense', icon: '🚌' },
  { id: '11111111-0004-4000-8000-000000000004', user_id: null, name: 'Entertainment', type: 'expense', icon: '🎬' },
  { id: '11111111-0005-4000-8000-000000000005', user_id: null, name: 'Gaming', type: 'expense', icon: '🎮' },
  { id: '11111111-0006-4000-8000-000000000006', user_id: null, name: 'Shopping', type: 'expense', icon: '🛍️' },
  { id: '11111111-0007-4000-8000-000000000007', user_id: null, name: 'Education', type: 'expense', icon: '📚' },
  { id: '11111111-0008-4000-8000-000000000008', user_id: null, name: 'Subscriptions', type: 'expense', icon: '📱' },
  { id: '11111111-0009-4000-8000-000000000009', user_id: null, name: 'Mobile/Data', type: 'expense', icon: '📶' },
  { id: '11111111-0010-4000-8000-000000000010', user_id: null, name: 'Clothing', type: 'expense', icon: '👕' },
  { id: '11111111-0011-4000-8000-000000000011', user_id: null, name: 'Sports', type: 'expense', icon: '⚽' },
  { id: '11111111-0012-4000-8000-000000000012', user_id: null, name: 'Travel', type: 'expense', icon: '✈️' },
  { id: '11111111-0013-4000-8000-000000000013', user_id: null, name: 'Gifts', type: 'expense', icon: '🎁' },
  { id: '11111111-0014-4000-8000-000000000014', user_id: null, name: 'Health', type: 'expense', icon: '💊' },
  { id: '11111111-0015-4000-8000-000000000015', user_id: null, name: 'Other', type: 'expense', icon: '📦' },
  // Income categories
  { id: '22222222-0001-4000-8000-000000000001', user_id: null, name: 'Pocket Money', type: 'income', icon: '💰' },
  { id: '22222222-0002-4000-8000-000000000002', user_id: null, name: 'Allowance', type: 'income', icon: '🏦' },
  { id: '22222222-0003-4000-8000-000000000003', user_id: null, name: 'Part-time Work', type: 'income', icon: '💼' },
  { id: '22222222-0004-4000-8000-000000000004', user_id: null, name: 'Gift', type: 'income', icon: '🎁' },
  { id: '22222222-0005-4000-8000-000000000005', user_id: null, name: 'Scholarship', type: 'income', icon: '🎓' },
  { id: '22222222-0006-4000-8000-000000000006', user_id: null, name: 'Other', type: 'income', icon: '💵' },
];

const DEMO_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

function getCategoryByName(name, type) {
  return INITIAL_CATEGORIES.find((c) => c.name === name && c.type === type)?.id;
}

function getDefaultStore() {
  const foodId = getCategoryByName('Food', 'expense');
  const gamingId = getCategoryByName('Gaming', 'expense');
  const transportId = getCategoryByName('Transportation', 'expense');
  const shoppingId = getCategoryByName('Shopping', 'expense');
  const entertainId = getCategoryByName('Entertainment', 'expense');
  const snacksId = getCategoryByName('Snacks', 'expense');
  const eduId = getCategoryByName('Education', 'expense');
  const subsId = getCategoryByName('Subscriptions', 'expense');

  const pocketMoneyId = getCategoryByName('Pocket Money', 'income');
  const partTimeId = getCategoryByName('Part-time Work', 'income');
  const giftId = getCategoryByName('Gift', 'income');

  return {
    users: [
      {
        id: DEMO_USER_ID,
        name: 'Demo Teen',
        email: 'demo@teentrack.app',
        // Real bcrypt hash for 'TestPass123' (12 rounds)
        password_hash: '$2a$12$jkmRtfO0E2Ostr4TYfNuXOvhCaDEpaqCOn9yVo.9yJ1MIY93GqJt2',
        created_at: '2026-08-01T00:00:00.000Z',
        updated_at: '2026-08-01T00:00:00.000Z',
      },
    ],
    categories: [...INITIAL_CATEGORIES],
    transactions: [
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: foodId,
        type: 'expense',
        amount: 250.0,
        description: 'Lunch at school canteen',
        transaction_date: '2026-09-15',
        payment_method: 'Cash',
        created_at: '2026-09-15T12:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: gamingId,
        type: 'expense',
        amount: 599.0,
        description: 'Mobile game subscription',
        transaction_date: '2026-09-10',
        payment_method: 'UPI',
        created_at: '2026-09-10T12:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: transportId,
        type: 'expense',
        amount: 150.0,
        description: 'Bus pass weekly',
        transaction_date: '2026-09-08',
        payment_method: 'Cash',
        created_at: '2026-09-08T12:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: shoppingId,
        type: 'expense',
        amount: 1200.0,
        description: 'New sneakers',
        transaction_date: '2026-09-05',
        payment_method: 'Debit Card',
        created_at: '2026-09-05T12:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: entertainId,
        type: 'expense',
        amount: 350.0,
        description: 'Movie with friends',
        transaction_date: '2026-09-20',
        payment_method: 'UPI',
        created_at: '2026-09-20T12:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: snacksId,
        type: 'expense',
        amount: 180.0,
        description: 'Snacks and drinks',
        transaction_date: '2026-09-22',
        payment_method: 'Cash',
        created_at: '2026-09-22T12:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: eduId,
        type: 'expense',
        amount: 450.0,
        description: 'Notebook and stationery',
        transaction_date: '2026-09-03',
        payment_method: 'Cash',
        created_at: '2026-09-03T12:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: subsId,
        type: 'expense',
        amount: 199.0,
        description: 'Spotify subscription',
        transaction_date: '2026-09-01',
        payment_method: 'UPI',
        created_at: '2026-09-01T12:00:00.000Z',
      },
      // Incomes
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: pocketMoneyId,
        type: 'income',
        amount: 5000.0,
        description: 'Monthly pocket money',
        transaction_date: '2026-09-01',
        payment_method: 'Bank Transfer',
        created_at: '2026-09-01T09:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: partTimeId,
        type: 'income',
        amount: 3000.0,
        description: 'Tutoring younger students',
        transaction_date: '2026-09-15',
        payment_method: 'UPI',
        created_at: '2026-09-15T18:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: giftId,
        type: 'income',
        amount: 2000.0,
        description: 'Birthday gift from uncle',
        transaction_date: '2026-09-18',
        payment_method: 'Cash',
        created_at: '2026-09-18T10:00:00.000Z',
      },
    ],
    budgets: [
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: foodId,
        amount: 2000.0,
        month: 9,
        year: 2026,
        created_at: '2026-09-01T00:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: entertainId,
        amount: 1000.0,
        month: 9,
        year: 2026,
        created_at: '2026-09-01T00:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: transportId,
        amount: 800.0,
        month: 9,
        year: 2026,
        created_at: '2026-09-01T00:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        category_id: shoppingId,
        amount: 1500.0,
        month: 9,
        year: 2026,
        created_at: '2026-09-01T00:00:00.000Z',
      },
    ],
    savings_goals: [
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        name: 'New Headphones',
        target_amount: 5000.0,
        current_amount: 2500.0,
        deadline: '2026-12-31',
        created_at: '2026-09-01T00:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        name: 'Gaming Console',
        target_amount: 35000.0,
        current_amount: 8000.0,
        deadline: '2027-06-30',
        created_at: '2026-09-01T00:00:00.000Z',
      },
      {
        id: crypto.randomUUID(),
        user_id: DEMO_USER_ID,
        name: 'Emergency Fund',
        target_amount: 10000.0,
        current_amount: 4200.0,
        deadline: null,
        created_at: '2026-09-01T00:00:00.000Z',
      },
    ],
  };
}

class LocalStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.warn('⚠️ Could not load local store file, initializing fresh store:', err.message);
    }
    const def = getDefaultStore();
    this.save(def);
    return def;
  }

  save(dataToSave = this.data) {
    try {
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf8');
    } catch (err) {
      console.warn('⚠️ Could not write local store file:', err.message);
    }
  }

  from(tableName) {
    return new LocalQueryBuilder(this, tableName);
  }
}

class LocalQueryBuilder {
  constructor(store, tableName) {
    this.store = store;
    this.tableName = tableName;
    this.filters = [];
    this.orFilters = [];
    this.sortField = null;
    this.sortAsc = true;
    this.limitCount = null;
    this.rangeFrom = null;
    this.rangeTo = null;
    this.isSingle = false;
    this.selectFields = '*';
    this.action = 'select'; // 'select' | 'insert' | 'update' | 'delete'
    this.payload = null;
  }

  select(fields = '*') {
    this.selectFields = fields;
    return this;
  }

  insert(data) {
    this.action = 'insert';
    this.payload = data;
    return this;
  }

  update(data) {
    this.action = 'update';
    this.payload = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(field, value) {
    this.filters.push((row) => row[field] === value);
    return this;
  }

  neq(field, value) {
    this.filters.push((row) => row[field] !== value);
    return this;
  }

  gte(field, value) {
    this.filters.push((row) => row[field] >= value);
    return this;
  }

  lte(field, value) {
    this.filters.push((row) => row[field] <= value);
    return this;
  }

  ilike(field, pattern) {
    const cleanPattern = pattern.replace(/^%|%$/g, '').toLowerCase();
    this.filters.push((row) => String(row[field] || '').toLowerCase().includes(cleanPattern));
    return this;
  }

  or(expr) {
    // e.g. "user_id.eq.xxx,user_id.is.null"
    const clauses = expr.split(',').map((c) => c.trim());
    this.orFilters.push((row) => {
      return clauses.some((clause) => {
        if (clause.includes('.is.null')) {
          const field = clause.split('.is.null')[0];
          return row[field] === null || row[field] === undefined;
        }
        if (clause.includes('.eq.')) {
          const [field, val] = clause.split('.eq.');
          return String(row[field]) === String(val);
        }
        return false;
      });
    });
    return this;
  }

  order(field, { ascending = true } = {}) {
    this.sortField = field;
    this.sortAsc = ascending;
    return this;
  }

  limit(count) {
    this.limitCount = count;
    return this;
  }

  range(from, to) {
    this.rangeFrom = from;
    this.rangeTo = to;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  _attachRelations(item) {
    if (!item) return item;
    const copy = { ...item };
    if (this.selectFields.includes('categories:category_id') && copy.category_id) {
      const cat = (this.store.data.categories || []).find((c) => c.id === copy.category_id);
      copy.categories = cat ? { id: cat.id, name: cat.name, type: cat.type, icon: cat.icon } : null;
    }
    return copy;
  }

  async execute() {
    const list = this.store.data[this.tableName] || [];

    if (this.action === 'insert') {
      const rows = Array.isArray(this.payload) ? this.payload : [this.payload];
      const inserted = rows.map((r) => {
        const item = {
          id: r.id || crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...r,
        };
        list.push(item);
        return this._attachRelations(item);
      });
      this.store.save();
      const res = this.isSingle || !Array.isArray(this.payload) ? inserted[0] : inserted;
      return { data: res, error: null };
    }

    if (this.action === 'update') {
      const matching = list.filter((row) => {
        return this.filters.every((fn) => fn(row)) && (this.orFilters.length === 0 || this.orFilters.some((fn) => fn(row)));
      });

      matching.forEach((row) => {
        Object.assign(row, this.payload, { updated_at: new Date().toISOString() });
      });

      this.store.save();
      const resultData = matching.map((m) => this._attachRelations(m));
      return { data: this.isSingle ? (resultData[0] || null) : resultData, error: null };
    }

    if (this.action === 'delete') {
      const initialLen = list.length;
      const remaining = list.filter((row) => {
        const matchesAll = this.filters.every((fn) => fn(row)) && (this.orFilters.length === 0 || this.orFilters.some((fn) => fn(row)));
        return !matchesAll;
      });
      this.store.data[this.tableName] = remaining;
      this.store.save();
      return { data: null, error: null };
    }

    // Default: SELECT
    let result = list.filter((row) => {
      const passedFilters = this.filters.every((fn) => fn(row));
      const passedOr = this.orFilters.length === 0 || this.orFilters.some((fn) => fn(row));
      return passedFilters && passedOr;
    });

    if (this.sortField) {
      result.sort((a, b) => {
        const valA = a[this.sortField];
        const valB = b[this.sortField];
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        return this.sortAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
    }

    if (this.rangeFrom !== null && this.rangeTo !== null) {
      result = result.slice(this.rangeFrom, this.rangeTo + 1);
    } else if (this.limitCount !== null) {
      result = result.slice(0, this.limitCount);
    }

    const mapped = result.map((r) => this._attachRelations(r));

    if (this.isSingle) {
      if (mapped.length === 0) {
        return { data: null, error: { code: 'PGRST116', message: 'Row not found' } };
      }
      return { data: mapped[0], error: null };
    }

    return { data: mapped, error: null };
  }

  // Support direct `await supabase.from(...)`
  then(resolve, reject) {
    return this.execute().then(resolve, reject);
  }
}

module.exports = new LocalStore();
