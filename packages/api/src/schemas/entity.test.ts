import { describe, it, expect } from 'bun:test';
import { EntitySchema, CreateEntityInput, UpdateEntityInput } from './schemas';

// ========== Entity Schemas ==========

describe('EntitySchema', () => {
  const validEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    worldId: '223e4567-e89b-12d3-a456-426614174000',
    definitionId: '323e4567-e89b-12d3-a456-426614174000',
    name: 'Aragorn',
    body: '# Character details\nA ranger and king',
    properties: {
      age: 87,
      alignment: 'good',
      tags: ['ranger', 'king'],
    },
    embedding: [0.1, 0.2, 0.3],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('valid inputs', () => {
    it('should accept valid entity', () => {
      const result = EntitySchema.safeParse(validEntity);
      expect(result.success).toBe(true);
    });

    it('should accept entity without embedding', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
        body: 'Character details',
        properties: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should accept empty properties', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
        body: 'Details',
        properties: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const input = { ...validEntity, worldId: 'not-uuid' };
      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const input = { ...validEntity, name: '' };
      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const input = { ...validEntity, name: 'a'.repeat(256) };
      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid property values', () => {
      const input = {
        ...validEntity,
        properties: {
          invalid: { nested: 'object' },
        },
      };

      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreateEntityInput', () => {
  describe('valid inputs', () => {
    it('should accept valid create input', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
        body: 'Character details',
        properties: {
          age: 87,
          alignment: 'good',
        },
      };

      const result = CreateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should apply default empty body', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
      };

      const result = CreateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body).toBe('');
      }
    });

    it('should apply default empty properties', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
      };

      const result = CreateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.properties).toEqual({});
      }
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const invalidInput = {
        worldId: 'not-uuid',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
      };

      const result = CreateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: '',
      };

      const result = CreateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing definitionId', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
      };

      const result = CreateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('UpdateEntityInput', () => {
  describe('valid inputs', () => {
    it('should accept update with name only', () => {
      const validInput = {
        name: 'Updated Name',
      };

      const result = UpdateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with body only', () => {
      const validInput = {
        body: 'Updated body content',
      };

      const result = UpdateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with properties only', () => {
      const validInput = {
        properties: {
          age: 88,
          alignment: 'neutral',
        },
      };

      const result = UpdateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with all fields', () => {
      const validInput = {
        name: 'Updated Name',
        body: 'Updated body',
        properties: { age: 88 },
      };

      const result = UpdateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept empty update object', () => {
      const validInput = {};

      const result = UpdateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty name', () => {
      const invalidInput = {
        name: '',
      };

      const result = UpdateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const invalidInput = {
        name: 'a'.repeat(256),
      };

      const result = UpdateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject invalid property values', () => {
      const invalidInput = {
        properties: {
          invalid: { nested: 'object' },
        },
      };

      const result = UpdateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
