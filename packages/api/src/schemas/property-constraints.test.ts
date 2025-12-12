import { describe, it, expect } from 'bun:test';
import { PropertyConstraintsSchema } from './schemas';

// ========== Property Constraint Schemas ==========

describe('PropertyConstraintsSchema', () => {
  describe('valid inputs', () => {
    it('should accept numeric constraints', () => {
      const validInput = {
        minValue: 0,
        maxValue: 100,
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept string length constraints', () => {
      const validInput = {
        minLength: 1,
        maxLength: 255,
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept pattern constraint', () => {
      const validInput = {
        pattern: '^[a-zA-Z0-9]+$',
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept select options', () => {
      const validInput = {
        options: ['good', 'neutral', 'evil'],
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept referencedEntityDefinitionId', () => {
      const validInput = {
        referencedEntityDefinitionId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept empty object', () => {
      const validInput = {};

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept combined constraints', () => {
      const validInput = {
        minValue: 0,
        maxValue: 100,
        minLength: 5,
        maxLength: 50,
        pattern: '[0-9]+',
        options: ['A', 'B'],
        referencedEntityDefinitionId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject non-numeric minValue', () => {
      const invalidInput = {
        minValue: 'zero',
      };

      const result = PropertyConstraintsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject non-array options', () => {
      const invalidInput = {
        options: 'not-an-array',
      };

      const result = PropertyConstraintsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject non-string pattern', () => {
      const invalidInput = {
        pattern: 123,
      };

      const result = PropertyConstraintsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject invalid referencedEntityDefinitionId uuid', () => {
      const invalidInput = {
        referencedEntityDefinitionId: 'not-uuid',
      };

      const result = PropertyConstraintsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
