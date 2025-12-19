import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { GetWorldUseCase } from '../get-world';
import type { IWorldRepository } from '../../../domain/world/world.repository';
import { World } from '../../../domain/world/world';
import { worldId, userId } from '../../../domain/shared/ids';
import { NotFoundError } from '../../errors';

describe('GetWorldUseCase', () => {
  const testWorldId = worldId('12345678-1234-4123-8123-123456789abc');
  const testOwnerId = userId('12345678-1234-4123-8123-123456789def');

  const mockFindById = mock<(id: string) => Promise<World | null>>(() => Promise.resolve(null));

  const mockWorldRepo: IWorldRepository = {
    findById: mockFindById,
    findAll: mock<() => Promise<World[]>>(() => Promise.resolve([])),
    count: mock(() => Promise.resolve(0)),
    existsByName: mock(() => Promise.resolve(false)),
    save: mock(() => Promise.resolve()),
    delete: mock(() => Promise.resolve(false)),
    searchByName: mock<() => Promise<World[]>>(() => Promise.resolve([])),
  };

  let useCase: GetWorldUseCase;

  beforeEach(() => {
    mockFindById.mockReset();
    useCase = new GetWorldUseCase(mockWorldRepo);
  });

  describe('execute', () => {
    it('returns a world when found', async () => {
      // Arrange
      const existingWorld = World.create({
        ownerId: testOwnerId,
        name: 'Test World',
        description: 'A test world',
      });
      mockFindById.mockImplementation(() => Promise.resolve(existingWorld));

      // Act
      const result = await useCase.execute(testWorldId);

      // Assert
      expect(result).toBe(existingWorld);
      expect(mockFindById).toHaveBeenCalledWith(testWorldId);
    });

    it('throws NotFoundError when world does not exist', async () => {
      // Arrange
      mockFindById.mockImplementation(() => Promise.resolve(null));

      // Act & Assert
      expect(useCase.execute(testWorldId)).rejects.toThrow(NotFoundError);
    });

    it('includes world id in NotFoundError', async () => {
      // Arrange
      mockFindById.mockImplementation(() => Promise.resolve(null));

      // Act & Assert
      try {
        await useCase.execute(testWorldId);
        expect.unreachable('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
        expect((error as NotFoundError).resourceId).toBe(testWorldId);
        expect((error as NotFoundError).resourceType).toBe('World');
      }
    });
  });
});
