import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { DeleteWorldUseCase } from '../delete-world';
import type { IWorldRepository } from '../../../domain/world/world.repository';
import { worldId } from '../../../domain/shared/ids';
import { NotFoundError } from '../../errors';

describe('DeleteWorldUseCase', () => {
  const testWorldId = worldId('12345678-1234-4123-8123-123456789abc');

  const mockDelete = mock(() => Promise.resolve(true));

  const mockWorldRepo: IWorldRepository = {
    findById: mock(() => Promise.resolve(null)),
    findAll: mock(() => Promise.resolve([])),
    count: mock(() => Promise.resolve(0)),
    existsByName: mock(() => Promise.resolve(false)),
    save: mock(() => Promise.resolve()),
    delete: mockDelete,
    searchByName: mock(() => Promise.resolve([])),
  };

  let useCase: DeleteWorldUseCase;

  beforeEach(() => {
    mockDelete.mockReset();
    mockDelete.mockImplementation(() => Promise.resolve(true));
    useCase = new DeleteWorldUseCase(mockWorldRepo);
  });

  describe('execute', () => {
    it('deletes an existing world', async () => {
      // Act
      await useCase.execute(testWorldId);

      // Assert
      expect(mockDelete).toHaveBeenCalledWith(testWorldId);
    });

    it('throws NotFoundError when world does not exist', async () => {
      // Arrange
      mockDelete.mockImplementation(() => Promise.resolve(false));

      // Act & Assert
      expect(useCase.execute(testWorldId)).rejects.toThrow(NotFoundError);
    });

    it('includes world id in NotFoundError', async () => {
      // Arrange
      mockDelete.mockImplementation(() => Promise.resolve(false));

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
