const supabase = require('../config/supabase');

class SavingsGoalModel {
  static async create({ user_id, name, target_amount, current_amount = 0, deadline }) {
    const { data, error } = await supabase
      .from('savings_goals')
      .insert({
        user_id,
        name,
        target_amount,
        current_amount,
        deadline: deadline || null,
      })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async findById(id, userId) {
    const { data, error } = await supabase
      .from('savings_goals')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id, userId, updates) {
    const allowedFields = ['name', 'target_amount', 'current_amount', 'deadline'];
    const sanitized = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        sanitized[key] = updates[key];
      }
    }
    sanitized.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('savings_goals')
      .update(sanitized)
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async addMoney(id, userId, amount) {
    // First get current amount
    const goal = await SavingsGoalModel.findById(id, userId);
    if (!goal) return null;

    const newAmount = parseFloat(goal.current_amount) + parseFloat(amount);

    const { data, error } = await supabase
      .from('savings_goals')
      .update({
        current_amount: newAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id, userId) {
    const { error } = await supabase
      .from('savings_goals')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}

module.exports = SavingsGoalModel;
