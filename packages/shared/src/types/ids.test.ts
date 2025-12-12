import { describe, it, expect } from 'vitest';
import {
  worldId,
  entityDefinitionId,
  propertyDefinitionId,
  entityId,
  relationshipId,
  isValidUuid,
  type WorldId,
  type EntityDefinitionId,
  type PropertyDefinitionId,
  type EntityId,
  type RelationshipId,
} from './ids';

// ========== ID Factory Functions ==========

describe('ID Factory Functions', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';

  describe('worldId', () => {
    it('should create a WorldId from a string', () => {
      const id = worldId(validUuid);
      expect(id).toBe(validUuid);
      // TypeScript will ensure this is a WorldId at compile time
      const _typeCheck: WorldId = id;
      expect(_typeCheck).toBe(validUuid);
    });

    it('should preserve the original string value', () => {
      const original = 'test-id-123';
      const id = worldId(original);
      expect(id).toBe(original);
    });
  });

  describe('entityDefinitionId', () => {
    it('should create an EntityDefinitionId from a string', () => {
      const id = entityDefinitionId(validUuid);
      expect(id).toBe(validUuid);
      const _typeCheck: EntityDefinitionId = id;
      expect(_typeCheck).toBe(validUuid);
    });
  });

  describe('propertyDefinitionId', () => {
    it('should create a PropertyDefinitionId from a string', () => {
      const id = propertyDefinitionId(validUuid);
      expect(id).toBe(validUuid);
      const _typeCheck: PropertyDefinitionId = id;
      expect(_typeCheck).toBe(validUuid);
    });
  });

  describe('entityId', () => {
    it('should create an EntityId from a string', () => {
      const id = entityId(validUuid);
      expect(id).toBe(validUuid);
      const _typeCheck: EntityId = id;
      expect(_typeCheck).toBe(validUuid);
    });
  });

  describe('relationshipId', () => {
    it('should create a RelationshipId from a string', () => {
      const id = relationshipId(validUuid);
      expect(id).toBe(validUuid);
      const _typeCheck: RelationshipId = id;
      expect(_typeCheck).toBe(validUuid);
    });
  });
});

// ========== Type Guard ==========

describe('isValidUuid', () => {
  describe('valid UUIDs', () => {
    it('should return true for valid UUID v4', () => {
      expect(isValidUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true);
    });

    it('should return true for uppercase UUID', () => {
      expect(isValidUuid('123E4567-E89B-12D3-A456-426614174000')).toBe(true);
    });

    it('should return true for mixed case UUID', () => {
      expect(isValidUuid('123e4567-E89B-12d3-A456-426614174000')).toBe(true);
    });

    it('should return true for UUID with all zeros', () => {
      expect(isValidUuid('00000000-0000-0000-0000-000000000000')).toBe(true);
    });

    it('should return true for UUID with all f', () => {
      expect(isValidUuid('ffffffff-ffff-ffff-ffff-ffffffffffff')).toBe(true);
    });
  });

  describe('invalid UUIDs', () => {
    it('should return false for empty string', () => {
      expect(isValidUuid('')).toBe(false);
    });

    it('should return false for non-string values', () => {
      expect(isValidUuid(123)).toBe(false);
      expect(isValidUuid(null)).toBe(false);
      expect(isValidUuid(undefined)).toBe(false);
      expect(isValidUuid({})).toBe(false);
      expect(isValidUuid([])).toBe(false);
    });

    it('should return false for UUID without dashes', () => {
      expect(isValidUuid('123e4567e89b12d3a456426614174000')).toBe(false);
    });

    it('should return false for UUID with wrong dash positions', () => {
      expect(isValidUuid('123e456-7e89b-12d3-a456-426614174000')).toBe(false);
    });

    it('should return false for UUID with invalid characters', () => {
      expect(isValidUuid('123e4567-e89b-12d3-a456-42661417400g')).toBe(false);
    });

    it('should return false for UUID that is too short', () => {
      expect(isValidUuid('123e4567-e89b-12d3-a456-42661417400')).toBe(false);
    });

    it('should return false for UUID that is too long', () => {
      expect(isValidUuid('123e4567-e89b-12d3-a456-4266141740000')).toBe(false);
    });

    it('should return false for random string', () => {
      expect(isValidUuid('not-a-uuid')).toBe(false);
    });

    it('should return false for UUID with spaces', () => {
      expect(isValidUuid('123e4567-e89b-12d3-a456-426614174000 ')).toBe(false);
      expect(isValidUuid(' 123e4567-e89b-12d3-a456-426614174000')).toBe(false);
    });
  });
});

// ========== Type Safety Tests ==========

describe('Type Safety', () => {
  it('branded IDs should be assignable to string', () => {
    const wId: WorldId = worldId('test');
    const str: string = wId; // Should compile
    expect(str).toBe('test');
  });

  it('different ID types should not be interchangeable at compile time', () => {
    // This test documents the compile-time behavior
    // At runtime, all IDs are just strings
    const wId = worldId('world-1');
    const eId = entityId('entity-1');

    // Both are strings at runtime
    expect(typeof wId).toBe('string');
    expect(typeof eId).toBe('string');

    // But TypeScript prevents: const wrong: WorldId = eId; // Compile error!
    // We can only verify this behavior exists via successful compilation
  });

  it('should work with Record types using branded IDs as keys', () => {
    const propDefId = propertyDefinitionId('prop-1');
    const properties: Record<PropertyDefinitionId, string> = {
      [propDefId]: 'value',
    };

    expect(properties[propDefId]).toBe('value');
  });
});
