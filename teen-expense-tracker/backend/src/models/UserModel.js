const supabase = require('../config/supabase');

class UserModel {
  static async create({ name, email, password_hash }) {
    const { data, error } = await supabase
      .from('users')
      .insert({ name, email, password_hash })
      .select('id, name, email, created_at')
      .single();

    if (error) throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, created_at, updated_at')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateProfile(id, updates) {
    const allowedFields = ['name', 'email'];
    const sanitized = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        sanitized[key] = updates[key];
      }
    }
    sanitized.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('users')
      .update(sanitized)
      .eq('id', id)
      .select('id, name, email, created_at, updated_at')
      .single();

    if (error) throw error;
    return data;
  }

  static async updatePassword(id, password_hash) {
    const { error } = await supabase
      .from('users')
      .update({ password_hash, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  }

  static async getPasswordHash(id) {
    const { data, error } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data?.password_hash;
  }
}

module.exports = UserModel;
