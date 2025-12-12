import { describe, it, expect } from 'bun:test';
import { WorldSchema, CreateWorldInput, UpdateWorldInput } from './schemas';

// ========== World Schemas ==========

describe('WorldSchema', () => {
  describe('valid inputs', () => {
    it('should accept a valid world object', () => {
      const validWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My World',
        description: 'A magical world',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(validWorld);
      expect(result.success).toBe(true);
    });

    it('should accept world without description', () => {
      const validWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My World',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(validWorld);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid uuid id', () => {
      const invalidWorld = {
        id: 'not-a-uuid',
        name: 'My World',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(invalidWorld);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(invalidWorld);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255 characters', () => {
      const invalidWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'a'.repeat(256),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(invalidWorld);
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 1000 characters', () => {
      const invalidWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My World',
        description: 'a'.repeat(1001),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(invalidWorld);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const invalidWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My World',
      };

      const result = WorldSchema.safeParse(invalidWorld);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreateWorldInput', () => {
  describe('valid inputs', () => {
    it('should accept valid create input', () => {
      const validInput = {
        name: 'My World',
        description: 'A magical world',
      };

      const result = CreateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept input without optional description', () => {
      const validInput = {
        name: 'My World',
      };

      const result = CreateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept maximum length name and description', () => {
      const validInput = {
        name: 'a'.repeat(255),
        description: 'a'.repeat(1000),
      };

      const result = CreateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty name', () => {
      const invalidInput = {
        name: '',
      };

      const result = CreateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const invalidInput = {
        name: 'a'.repeat(256),
      };

      const result = CreateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 1000', () => {
      const invalidInput = {
        name: 'My World',
        description: 'a'.repeat(1001),
      };

      const result = CreateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing name', () => {
      const invalidInput = {
        description: 'A world',
      };

      const result = CreateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('UpdateWorldInput', () => {
  const id = '123e4567-e89b-12d3-a456-426614174000';

  describe('valid inputs', () => {
    it('should accept update with name only', () => {
      const validInput = {
        id,
        name: 'Updated World',
      };

      const result = UpdateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with description only', () => {
      const validInput = {
        id,
        description: 'Updated description',
      };

      const result = UpdateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with null description', () => {
      const validInput = {
        id,
        description: null,
      };

      const result = UpdateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with both fields', () => {
      const validInput = {
        id,
        name: 'Updated World',
        description: 'Updated description',
      };

      const result = UpdateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with only id', () => {
      const validInput = { id };

      const result = UpdateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject missing id', () => {
      const invalidInput = {
        name: 'Updated World',
      };

      const result = UpdateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidInput = {
        id,
        name: '',
      };

      const result = UpdateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const invalidInput = {
        id,
        name: 'a'.repeat(256),
      };

      const result = UpdateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 1000', () => {
      const invalidInput = {
        id,
        description: 'a'.repeat(1001),
      };

      const result = UpdateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
