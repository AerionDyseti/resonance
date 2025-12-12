import { describe, it, expect } from 'bun:test';
import { PaginationInput, SearchInput } from './schemas';

// ========== Query Input Schemas ==========

describe('PaginationInput', () => {
  describe('valid inputs', () => {
    it('should accept valid pagination input', () => {
      const validInput = {
        page: 1,
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should apply default page=1 when missing', () => {
      const validInput = {
        pageSize: 20,
      };

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
      }
    });

    it('should apply default pageSize=10 when missing', () => {
      const validInput = {
        page: 2,
      };

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pageSize).toBe(10);
      }
    });

    it('should apply both defaults when empty object', () => {
      const validInput = {};

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.pageSize).toBe(10);
      }
    });

    it('should accept max pageSize of 100', () => {
      const validInput = {
        page: 1,
        pageSize: 100,
      };

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept large page numbers', () => {
      const validInput = {
        page: 999999,
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject zero page', () => {
      const invalidInput = {
        page: 0,
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject negative page', () => {
      const invalidInput = {
        page: -1,
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject zero pageSize', () => {
      const invalidInput = {
        page: 1,
        pageSize: 0,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject pageSize greater than 100', () => {
      const invalidInput = {
        page: 1,
        pageSize: 101,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject negative pageSize', () => {
      const invalidInput = {
        page: 1,
        pageSize: -10,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject float page number', () => {
      const invalidInput = {
        page: 1.5,
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject float pageSize', () => {
      const invalidInput = {
        page: 1,
        pageSize: 10.5,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric page', () => {
      const invalidInput = {
        page: 'one',
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('SearchInput', () => {
  describe('valid inputs', () => {
    it('should accept valid search input', () => {
      const validInput = {
        query: 'aragorn',
        limit: 10,
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should apply default limit=10 when missing', () => {
      const validInput = {
        query: 'aragorn',
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(10);
      }
    });

    it('should accept max limit of 100', () => {
      const validInput = {
        query: 'aragorn',
        limit: 100,
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept query with special characters', () => {
      const validInput = {
        query: 'character_name-123 @special',
        limit: 10,
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept query with spaces', () => {
      const validInput = {
        query: 'aragorn king of gondor',
        limit: 10,
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept long query', () => {
      const validInput = {
        query: 'a'.repeat(500),
        limit: 10,
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty query string', () => {
      const invalidInput = {
        query: '',
        limit: 10,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing query', () => {
      const invalidInput = {
        limit: 10,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject limit of zero', () => {
      const invalidInput = {
        query: 'aragorn',
        limit: 0,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject limit greater than 100', () => {
      const invalidInput = {
        query: 'aragorn',
        limit: 101,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject negative limit', () => {
      const invalidInput = {
        query: 'aragorn',
        limit: -10,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject float limit', () => {
      const invalidInput = {
        query: 'aragorn',
        limit: 10.5,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric limit', () => {
      const invalidInput = {
        query: 'aragorn',
        limit: 'ten',
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
