import { describe, it, expect } from 'bun:test';
import { RelationshipSchema, CreateRelationshipInput, UpdateRelationshipInput } from './schemas';

// ========== Relationship Schemas ==========

describe('RelationshipSchema', () => {
  const validRelationship = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    worldId: '223e4567-e89b-12d3-a456-426614174000',
    fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
    toEntityId: '423e4567-e89b-12d3-a456-426614174000',
    type: 'parent',
    description: 'A is parent of B',
    metadata: {
      strength: 'strong',
      since: '2024-01-01',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('valid inputs', () => {
    it('should accept valid relationship', () => {
      const result = RelationshipSchema.safeParse(validRelationship);
      expect(result.success).toBe(true);
    });

    it('should accept relationship without optional fields', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should accept various metadata types', () => {
      const input = {
        ...validRelationship,
        metadata: {
          string: 'value',
          number: 42,
          boolean: true,
          array: [1, 'two', true],
          nested: { key: 'value' },
        },
      };

      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const input = { ...validRelationship, worldId: 'not-uuid' };
      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid fromEntityId uuid', () => {
      const input = { ...validRelationship, fromEntityId: 'not-uuid' };
      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid toEntityId uuid', () => {
      const input = { ...validRelationship, toEntityId: 'not-uuid' };
      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty type string', () => {
      const input = { ...validRelationship, type: '' };
      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreateRelationshipInput', () => {
  describe('valid inputs', () => {
    it('should accept valid create input', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
        description: 'A is parent of B',
        metadata: {
          strength: 'strong',
        },
      };

      const result = CreateRelationshipInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept without optional fields', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
      };

      const result = CreateRelationshipInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept with only description', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
        description: 'A parent-child relationship',
      };

      const result = CreateRelationshipInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const invalidInput = {
        worldId: 'not-uuid',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
      };

      const result = CreateRelationshipInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject empty type', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: '',
      };

      const result = CreateRelationshipInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing toEntityId', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
      };

      const result = CreateRelationshipInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('UpdateRelationshipInput', () => {
  describe('valid inputs', () => {
    it('should accept update with type only', () => {
      const result = UpdateRelationshipInput.safeParse({ type: 'ally' });
      expect(result.success).toBe(true);
    });

    it('should accept update with description only', () => {
      const result = UpdateRelationshipInput.safeParse({
        description: 'Updated description',
      });
      expect(result.success).toBe(true);
    });

    it('should accept update with metadata only', () => {
      const result = UpdateRelationshipInput.safeParse({
        metadata: { key: 'value' },
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty update object', () => {
      const result = UpdateRelationshipInput.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty type', () => {
      const result = UpdateRelationshipInput.safeParse({ type: '' });
      expect(result.success).toBe(false);
    });
  });
});
