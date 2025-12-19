import { z } from 'zod';

/**
 * Input schema for creating a new world
 */
export const createWorldInputSchema = z.object({
  ownerId: z.string().uuid(),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be 255 characters or less')
    .transform((s) => s.trim()),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .transform((s) => s.trim())
    .optional(),
});

export type CreateWorldInput = z.infer<typeof createWorldInputSchema>;

/**
 * Input schema for updating a world
 */
export const updateWorldInputSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be 255 characters or less')
    .transform((s) => s.trim())
    .optional(),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .transform((s) => s.trim())
    .nullable()
    .optional(),
});

export type UpdateWorldInput = z.infer<typeof updateWorldInputSchema>;

/**
 * Input schema for listing worlds with pagination
 */
export const listWorldsInputSchema = z.object({
  limit: z.number().int().positive().max(100).default(20),
  offset: z.number().int().nonnegative().default(0),
});

export type ListWorldsInput = z.infer<typeof listWorldsInputSchema>;
