const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../../config/supabaseClient');
const { ApiError } = require('../../utils/apiResponse');

const register = async ({ name, email, password }) => {
  const normalizedEmail = email.toLowerCase();

  // Check if user exists using maybeSingle() to avoid error on 0 rows
  const { data: existingUser, error: existError } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle();


  if (existError) {
    throw new ApiError(500, 'Database error while checking user existence');
  }

  if (existingUser) {
    throw new ApiError(409, 'Email is already registered');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Directly assign 'viewer' role; ignore any role request from client
  const role = 'viewer';

  // Insert to Supabase directly
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([
      {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
      },
    ])
    .select('id, name, email, role, is_active, created_at')
    .single();

  if (error) {
    throw new ApiError(500, 'Error creating user', [error]);
  }

  return newUser;
};

const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase();

  // Find user by email
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', normalizedEmail)
    .maybeSingle();

  if (error) {
    throw new ApiError(500, 'Database error during login');
  }

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.is_active) {
    throw new ApiError(403, 'Account is deactivated');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!process.env.JWT_SECRET) {
    throw new ApiError(500, 'Internal Server Error: Missing JWT Secret');
  }

  // Generate JWT Profile
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  // Exclude password from response
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

module.exports = {
  register,
  login,
};
