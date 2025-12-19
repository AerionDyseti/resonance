import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { ListWorldsUseCase } from '../list-worlds';
import type { IWorldRepository } from '../../../domain/world/world.repository';
import { World } from '../../../domain/world/world';
import { userId } from '../../../domain/shared/ids';

describe('ListWorldsUseCase', () => {
  const testOwnerId = userId('12345678-1234-4123-8123-123456789abc');

  const mockFindAll = mock<(params?: { limit: number; offset: number }) => Promise<World[]>>(() =>
    Promise.resolve([])
  );
  const mockCount = mock(() => Promise.resolve(0));

  const mockWorldRepo: IWorldRepository = {
    findById: mock<() => Promise<World | null>>(() => Promise.resolve(null)),
    findAll: mockFindAll,
    count: mockCount,
    existsByName: mock(() => Promise.resolve(false)),
    save: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve(false)),
    searchByName: mock<() => Promise<World[]>>(() => Promise.resolve([])),
  };

  let useCase: ListWorldsUseCase;

  beforeEach(() => {
    mockFindAll.mockReset();
    mockCount.mockReset();
    mockFindAll.mockImplementation(() => Promise.resolve([]));
    mockCount.mockImplementation(() => Promise.resolve(0));
    useCase = new ListWorldsUseCase(mockWorldRepo);
  });

  describe('execute', () => {
    it('returns empty list when no worlds exist', async () => {
      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.worlds).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('returns worlds with default pagination', async () => {
      // Arrange
      const worlds = [
        World.create({ ownerId: testOwnerId, name: 'World 1' }),
        World.create({ ownerId: testOwnerId, name: 'World 2' }),
      ];
      mockFindAll.mockImplementation(() => Promise.resolve(worlds));
      mockCount.mockImplementation(() => Promise.resolve(2));

      // Act
      const result = await useCase.execute();

      // Assert
      expect(result.worlds).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(mockFindAll).toHaveBeenCalledWith({ limit: 20, offset: 0 });
    });

    it('respects custom pagination parameters', async () => {
      // Arrange
      const worlds = [World.create({ ownerId: testOwnerId, name: 'World 3' })];
      mockFindAll.mockImplementation(() => Promise.resolve(worlds));
      mockCount.mockImplementation(() => Promise.resolve(10));

      // Act
      const result = await useCase.execute({ limit: 5, offset: 10 });

      // Assert
      expect(result.worlds).toHaveLength(1);
      expect(result.total).toBe(10);
      expect(mockFindAll).toHaveBeenCalledWith({ limit: 5, offset: 10 });
    });

    it('uses default limit when not specified', async () => {
      // Act
      await useCase.execute({ offset: 5 });

      // Assert
      expect(mockFindAll).toHaveBeenCalledWith({ limit: 20, offset: 5 });
    });

    it('uses default offset when not specified', async () => {
      // Act
      await useCase.execute({ limit: 10 });

      // Assert
      expect(mockFindAll).toHaveBeenCalledWith({ limit: 10, offset: 0 });
    });
  });
});
