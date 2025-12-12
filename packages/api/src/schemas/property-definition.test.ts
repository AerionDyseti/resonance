import { describe, it, expect } from 'bun:test';
import {
  PropertyDefinitionSchema,
  CreatePropertyDefinitionInput,
  UpdatePropertyDefinitionInput,
} from './schemas';
import { PropertyType } from '@resonance/shared';

// ========== Property Definition Schemas ==========

describe('PropertyDefinitionSchema', () => {
  const validPropertyDefinition = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    worldId: '223e4567-e89b-12d3-a456-426614174000',
    name: 'Age',
    type: PropertyType.Number,
    description: 'Character age',
    required: true,
    defaultValue: 18,
    constraints: {
      minValue: 0,
      maxValue: 1000,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('valid inputs', () => {
    it('should accept valid property definition', () => {
      const result = PropertyDefinitionSchema.safeParse(validPropertyDefinition);
      expect(result.success).toBe(true);
    });

    it('should accept property definition with string type', () => {
      const input = {
        ...validPropertyDefinition,
        type: PropertyType.Text,
        defaultValue: 'default',
      };

      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should accept property definition with select type', () => {
      const input = {
        ...validPropertyDefinition,
        type: PropertyType.Select,
        defaultValue: 'option1',
        constraints: {
          options: ['option1', 'option2', 'option3'],
        },
      };

      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should accept property definition without optional fields', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
        type: PropertyType.Number,
        required: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should accept all property type enum values', () => {
      const types = Object.values(PropertyType);
      types.forEach((type) => {
        const input = {
          ...validPropertyDefinition,
          type,
        };
        const result = PropertyDefinitionSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const input = { ...validPropertyDefinition, worldId: 'not-uuid' };
      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const input = { ...validPropertyDefinition, name: '' };
      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const input = { ...validPropertyDefinition, name: 'a'.repeat(256) };
      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid property type', () => {
      const input = { ...validPropertyDefinition, type: 'invalid_type' };
      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 1000', () => {
      const input = {
        ...validPropertyDefinition,
        description: 'a'.repeat(1001),
      };

      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject non-boolean required', () => {
      const input = { ...validPropertyDefinition, required: 'yes' };
      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid defaultValue', () => {
      const input = {
        ...validPropertyDefinition,
        defaultValue: { invalid: 'object' },
      };

      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreatePropertyDefinitionInput', () => {
  describe('valid inputs', () => {
    it('should accept valid create input', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
        type: PropertyType.Number,
        description: 'Character age',
        required: true,
        defaultValue: 18,
        constraints: {
          minValue: 0,
          maxValue: 1000,
        },
      };

      const result = CreatePropertyDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should apply default false for required', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
        type: PropertyType.Number,
      };

      const result = CreatePropertyDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.required).toBe(false);
      }
    });

    it('should accept without optional fields', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
        type: PropertyType.Number,
      };

      const result = CreatePropertyDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept with explicit required true', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Name',
        type: PropertyType.Text,
        required: true,
      };

      const result = CreatePropertyDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.required).toBe(true);
      }
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const invalidInput = {
        worldId: 'not-uuid',
        name: 'Age',
        type: PropertyType.Number,
      };

      const result = CreatePropertyDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: '',
        type: PropertyType.Number,
      };

      const result = CreatePropertyDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing type', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
      };

      const result = CreatePropertyDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject invalid property type', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
        type: 'invalid',
      };

      const result = CreatePropertyDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('UpdatePropertyDefinitionInput', () => {
  describe('valid inputs', () => {
    it('should accept update with name only', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });

    it('should accept update with type only', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({
        type: PropertyType.Text,
      });
      expect(result.success).toBe(true);
    });

    it('should accept update with required only', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({ required: true });
      expect(result.success).toBe(true);
    });

    it('should accept empty update object', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty name', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid type', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({ type: 'invalid' });
      expect(result.success).toBe(false);
    });
  });
});
