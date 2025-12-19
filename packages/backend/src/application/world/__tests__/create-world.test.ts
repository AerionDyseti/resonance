import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { CreateWorldUseCase } from '../create-world';
import type { IWorldRepository } from '../../../domain/world/world.repository';
import { World } from '../../../domain/world/world';
import { userId } from '../../../domain/shared/ids';
import { ConflictError } from '../../errors';

describe('CreateWorldUseCase', () => {
  // Use a valid UUID v4 format for testing (version 4 = 4xxx, variant = 8/9/a/b)
  const testOwnerId = userId('12345678-1234-4123-8123-123456789abc');

  // Create mock functions
  const mockFindById = mock(() => Promise.resolve(null));
  const mockFindAll = mock(() => Promise.resolve([]));
  const mockCount = mock(() => Promise.resolve(0));
  const mockExistsByName = mock(() => Promise.resolve(false));
  const mockSave = mock(() => Promise.resolve());
  const mockDelete = mock(() => Promise.resolve(false));
  const mockSearchByName = mock(() => Promise.resolve([]));

  const mockWorldRepo: IWorldRepository = {
    findById: mockFindById,
    findAll: mockFindAll,
    count: mockCount,
    existsByName: mockExistsByName,
    save: mockSave,
    delete: mockDelete,
    searchByName: mockSearchByName,
  };

  let useCase: CreateWorldUseCase;

  beforeEach(() => {
    // Reset all mocks
    mockFindById.mockReset();
    mockFindAll.mockReset();
    mockCount.mockReset();
    mockExistsByName.mockReset();
    mockSave.mockReset();
    mockDelete.mockReset();
    mockSearchByName.mockReset();

    // Set default mock implementations
    mockExistsByName.mockImplementation(() => Promise.resolve(false));
    mockSave.mockImplementation(() => Promise.resolve());

    useCase = new CreateWorldUseCase(mockWorldRepo);
  });

  describe('execute', () => {
    it('creates a world with valid input', async () => {
      // Act
      const result = await useCase.execute({
        ownerId: testOwnerId,
        name: 'Middle Earth',
        description: 'A fantasy world',
      });

      // Assert
      expect(result).toBeInstanceOf(World);
      expect(result.name).toBe('Middle Earth');
      expect(result.description).toBe('A fantasy world');
      expect(result.ownerId).toBe(testOwnerId);
      expect(mockExistsByName).toHaveBeenCalledWith('Middle Earth');
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('creates a world without description', async () => {
      // Act
      const result = await useCase.execute({
        ownerId: testOwnerId,
        name: 'Narnia',
      });

      // Assert
      expect(result).toBeInstanceOf(World);
      expect(result.name).toBe('Narnia');
      expect(result.description).toBeNull();
    });

    it('throws ConflictError when world name already exists', async () => {
      // Arrange
      mockExistsByName.mockImplementation(() => Promise.resolve(true));

      // Act & Assert
      expect(
        useCase.execute({
          ownerId: testOwnerId,
          name: 'Existing World',
        })
      ).rejects.toThrow(ConflictError);

      expect(mockSave).not.toHaveBeenCalled();
    });

    it('trims whitespace from name', async () => {
      // Act
      const result = await useCase.execute({
        ownerId: testOwnerId,
        name: '  Westeros  ',
      });

      // Assert
      expect(result.name).toBe('Westeros');
      expect(mockExistsByName).toHaveBeenCalledWith('Westeros');
    });

    it('trims whitespace from description', async () => {
      // Act
      const result = await useCase.execute({
        ownerId: testOwnerId,
        name: 'Azeroth',
        description: '  World of Warcraft setting  ',
      });

      // Assert
      expect(result.description).toBe('World of Warcraft setting');
    });

    it('throws error for empty name', async () => {
      // Act & Assert
      expect(
        useCase.execute({
          ownerId: testOwnerId,
          name: '',
        })
      ).rejects.toThrow();
    });

    it('throws error for name that is only whitespace', async () => {
      // Act & Assert
      expect(
        useCase.execute({
          ownerId: testOwnerId,
          name: '   ',
        })
      ).rejects.toThrow();
    });
  });
});
