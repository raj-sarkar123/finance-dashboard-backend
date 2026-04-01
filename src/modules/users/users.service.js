const bcrypt = require('bcrypt');
const supabase = require('../../config/supabaseClient');
const { ApiError } = require('../../utils/apiResponse');

const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, is_active, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new ApiError(500, 'Error fetching users', [error]);
  }

  return data;
};

const createUser = async ({ name, email, password, role, is_active }, currentUser) => {
  const normalizedEmail = email.toLowerCase();
  
  // Service layer RBAC enforcement:
  // Only an existing admin can assign 'admin' or 'analyst' roles.
  // This ensures no privilege escalation happens from other injection vectors.
  const assignedRole = role || 'viewer';
  if ((assignedRole === 'admin' || assignedRole === 'analyst') && currentUser.role !== 'admin') {
    throw new ApiError(403, 'Forbidden: Only admins can assign elevated roles');
  }

  // Check if user exists
  const { data: existingUser, error: existError } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (existError) {
    throw new ApiError(500, 'Database error while checking user existence');
  }

  if (existingUser) {
    throw new ApiError(409, 'Email already in use');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { data: newUser, error } = await supabase
    .from('users')
    .insert([{ name, email: normalizedEmail, password: hashedPassword, role: assignedRole, is_active }])
    .select('id, name, email, role, is_active, created_at')
    .single();

  if (error) {
    throw new ApiError(500, 'Error creating user', [error]);
  }

  return newUser;
};

const updateUser = async (id, updateData) => {
  // Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingUser) {
    throw new ApiError(404, 'User not found');
  }

  const { data: updatedUser, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', id)
    .select('id, name, email, role, is_active, created_at')
    .single();

  if (error) {
    throw new ApiError(500, 'Error updating user', [error]);
  }

  return updatedUser;
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
};
