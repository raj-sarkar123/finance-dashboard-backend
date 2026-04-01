const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['viewer', 'analyst', 'admin']).optional().default('viewer'),
  is_active: z.boolean().optional().default(true),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['viewer', 'analyst', 'admin']).optional(),
  is_active: z.boolean().optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
