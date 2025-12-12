import { describe, it, expect } from 'bun:test';
import {
  EntityDefinitionSchema,
  CreateEntityDefinitionInput,
  UpdateEntityDefinitionInput,
} from './schemas';

// ========== Entity Type Schemas ==========

describe('EntityDefinitionSchema', () => {
  const validEntityDefinition = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    worldId: '223e4567-e89b-12d3-a456-426614174000',
    name: 'Character',
    description: 'A character entity type',
    icon: 'person',
    propertyDefinitionIds: ['423e4567-e89b-12d3-a456-426614174000'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('valid inputs', () => {
    it('should accept valid entity type', () => {
      const result = EntityDefinitionSchema.safeParse(validEntityDefinition);
      expect(result.success).toBe(true);
    });

    it('should accept without optional description and icon', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Character',
        propertyDefinitionIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = EntityDefinitionSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const input = { ...validEntityDefinition, worldId: 'not-uuid' };
      const result = EntityDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const input = { ...validEntityDefinition, name: '' };
      const result = EntityDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const input = { ...validEntityDefinition, name: 'a'.repeat(256) };
      const result = EntityDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid propertyDefinitionId uuid', () => {
      const input = { ...validEntityDefinition, propertyDefinitionIds: ['not-uuid'] };
      const result = EntityDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreateEntityDefinitionInput', () => {
  describe('valid inputs', () => {
    it('should accept valid create input', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Character',
        description: 'A character type',
        icon: 'person',
        propertyDefinitionIds: ['423e4567-e89b-12d3-a456-426614174000'],
      };

      const result = CreateEntityDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should apply default empty array for propertyDefinitionIds', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Character',
      };

      const result = CreateEntityDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.propertyDefinitionIds).toEqual([]);
      }
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const invalidInput = {
        worldId: 'not-uuid',
        name: 'Character',
      };

      const result = CreateEntityDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: '',
      };

      const result = CreateEntityDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing worldId', () => {
      const invalidInput = {
        name: 'Character',
      };

      const result = CreateEntityDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('UpdateEntityDefinitionInput', () => {
  describe('valid inputs', () => {
    it('should accept update with name only', () => {
      const result = UpdateEntityDefinitionInput.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });

    it('should accept update with propertyDefinitionIds', () => {
      const result = UpdateEntityDefinitionInput.safeParse({
        propertyDefinitionIds: ['223e4567-e89b-12d3-a456-426614174000'],
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty update object', () => {
      const result = UpdateEntityDefinitionInput.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty name', () => {
      const result = UpdateEntityDefinitionInput.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid propertyDefinitionId uuid', () => {
      const result = UpdateEntityDefinitionInput.safeParse({
        propertyDefinitionIds: ['not-uuid'],
      });
      expect(result.success).toBe(false);
    });
  });
});
