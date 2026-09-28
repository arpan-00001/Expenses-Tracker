const supabase = require('../config/supabase');

class CategoryModel {
  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }

  static async findById(id, userId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .or(`user_id.eq.${userId},user_id.is.null`)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async create({ user_id, name, type, icon }) {
    const { data, error } = await supabase
      .from('categories')
      .insert({ user_id, name, type, icon })
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async update(id, userId, updates) {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id, userId) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }

  static async findByType(userId, type) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`user_id.eq.${userId},user_id.is.null`)
      .eq('type', type)
      .order('name', { ascending: true });

    if (error) throw error;
    return data;
  }
}

module.exports = CategoryModel;
