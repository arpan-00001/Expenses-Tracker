const supabase = require('../config/supabase');

class TransactionModel {
  static async create({ user_id, category_id, type, amount, description, transaction_date, payment_method }) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id,
        category_id,
        type,
        amount,
        description,
        transaction_date,
        payment_method: payment_method || 'Cash',
      })
      .select(`
        *,
        categories:category_id (id, name, type, icon)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async findByUserId(userId, filters = {}) {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (id, name, type, icon)
      `)
      .eq('user_id', userId);

    // Apply filters
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.startDate) {
      query = query.gte('transaction_date', filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte('transaction_date', filters.endDate);
    }
    if (filters.search) {
      query = query.ilike('description', `%${filters.search}%`);
    }
    if (filters.payment_method) {
      query = query.eq('payment_method', filters.payment_method);
    }

    // Sorting
    const sortBy = filters.sortBy || 'transaction_date';
    const sortOrder = filters.sortOrder === 'asc' ? { ascending: true } : { ascending: false };
    query = query.order(sortBy, sortOrder);

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return { data, page, limit };
  }

  static async findById(id, userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (id, name, type, icon)
      `)
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id, userId, updates) {
    const allowedFields = ['category_id', 'type', 'amount', 'description', 'transaction_date', 'payment_method'];
    const sanitized = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        sanitized[key] = updates[key];
      }
    }
    sanitized.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('transactions')
      .update(sanitized)
      .eq('id', id)
      .eq('user_id', userId)
      .select(`
        *,
        categories:category_id (id, name, type, icon)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id, userId) {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  static async getRecentByUserId(userId, limit = 5) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (id, name, type, icon)
      `)
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  static async getByDateRange(userId, startDate, endDate) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (id, name, type, icon)
      `)
      .eq('user_id', userId)
      .gte('transaction_date', startDate)
      .lte('transaction_date', endDate)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async getAllByUserId(userId) {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (id, name, type, icon)
      `)
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false });

    if (error) throw error;
    return data;
  }
}

module.exports = TransactionModel;
