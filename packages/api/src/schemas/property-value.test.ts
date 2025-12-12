import { describe, it, expect } from 'bun:test';
import { PropertyValueSchema } from './schemas';

// ========== Property Value Schema ==========

describe('PropertyValueSchema', () => {
  describe('valid inputs', () => {
    it('should accept string value', () => {
      const result = PropertyValueSchema.safeParse('hello');
      expect(result.success).toBe(true);
    });

    it('should accept number value', () => {
      const result = PropertyValueSchema.safeParse(42);
      expect(result.success).toBe(true);
    });

    it('should accept boolean value', () => {
      const result = PropertyValueSchema.safeParse(true);
      expect(result.success).toBe(true);
    });

    it('should accept array of strings', () => {
      const result = PropertyValueSchema.safeParse(['tag1', 'tag2']);
      expect(result.success).toBe(true);
    });

    it('should accept null value', () => {
      const result = PropertyValueSchema.safeParse(null);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject array of numbers', () => {
      const result = PropertyValueSchema.safeParse([1, 2, 3]);
      expect(result.success).toBe(false);
    });

    it('should reject object', () => {
      const result = PropertyValueSchema.safeParse({ key: 'value' });
      expect(result.success).toBe(false);
    });

    it('should reject undefined', () => {
      const result = PropertyValueSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });
});
