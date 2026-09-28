const supabase = require('../config/supabase');

class BudgetModel {
  static async create({ user_id, category_id, amount, month, year }) {
    const { data, error } = await supabase
      .from('budgets')
      .insert({ user_id, category_id, amount, month, year })
      .select(`
        *,
        categories:category_id (id, name, type, icon)
      `)
      .single();

    if (error) throw error;
    return data;
  }

  static async findByUserId(userId, month, year) {
    let query = supabase
      .from('budgets')
      .select(`
        *,
        categories:category_id (id, name, type, icon)
      `)
      .eq('user_id', userId);

    if (month) query = query.eq('month', month);
    if (year) query = query.eq('year', year);

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findById(id, userId) {
    const { data, error } = await supabase
      .from('budgets')
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

  static async findByUserCategoryMonth(userId, categoryId, month, year) {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .eq('month', month)
      .eq('year', year)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id, userId, updates) {
    const allowedFields = ['category_id', 'amount', 'month', 'year'];
    const sanitized = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        sanitized[key] = updates[key];
      }
    }
    sanitized.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('budgets')
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
      .from('budgets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}

module.exports = BudgetModel;
