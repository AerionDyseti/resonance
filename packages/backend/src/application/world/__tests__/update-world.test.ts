import { describe, it, expect, mock, beforeEach } from 'bun:test';
import { UpdateWorldUseCase } from '../update-world';
import type { IWorldRepository } from '../../../domain/world/world.repository';
import { World } from '../../../domain/world/world';
import { worldId, userId } from '../../../domain/shared/ids';
import { NotFoundError, ConflictError } from '../../errors';

describe('UpdateWorldUseCase', () => {
  const testWorldId = worldId('12345678-1234-4123-8123-123456789abc');
  const testOwnerId = userId('12345678-1234-4123-8123-123456789def');

  const mockFindById = mock<(id: string) => Promise<World | null>>(() => Promise.resolve(null));
  const mockExistsByName = mock(() => Promise.resolve(false));
  const mockSave = mock(() => Promise.resolve());

  const mockWorldRepo: IWorldRepository = {
    findById: mockFindById,
    findAll: mock<() => Promise<World[]>>(() => Promise.resolve([])),
    count: mock(() => Promise.resolve(0)),
    existsByName: mockExistsByName,
    save: mockSave,
    delete: mock(() => Promise.resolve(false)),
    searchByName: mock<() => Promise<World[]>>(() => Promise.resolve([])),
  };

  let useCase: UpdateWorldUseCase;
  let existingWorld: World;

  beforeEach(() => {
    mockFindById.mockReset();
    mockExistsByName.mockReset();
    mockSave.mockReset();

    existingWorld = World.create({
      ownerId: testOwnerId,
      name: 'Original Name',
      description: 'Original description',
    });

    mockFindById.mockImplementation(() => Promise.resolve(existingWorld));
    mockExistsByName.mockImplementation(() => Promise.resolve(false));
    mockSave.mockImplementation(() => Promise.resolve());

    useCase = new UpdateWorldUseCase(mockWorldRepo);
  });

  describe('execute', () => {
    it('updates world name', async () => {
      // Act
      const result = await useCase.execute({
        id: testWorldId,
        name: 'New Name',
      });

      // Assert
      expect(result.name).toBe('New Name');
      expect(result.description).toBe('Original description');
      expect(mockSave).toHaveBeenCalledTimes(1);
    });

    it('updates world description', async () => {
      // Act
      const result = await useCase.execute({
        id: testWorldId,
        description: 'New description',
      });

      // Assert
      expect(result.name).toBe('Original Name');
      expect(result.description).toBe('New description');
    });

    it('updates both name and description', async () => {
      // Act
      const result = await useCase.execute({
        id: testWorldId,
        name: 'New Name',
        description: 'New description',
      });

      // Assert
      expect(result.name).toBe('New Name');
      expect(result.description).toBe('New description');
    });

    it('allows setting description to null', async () => {
      // Act
      const result = await useCase.execute({
        id: testWorldId,
        description: null,
      });

      // Assert
      expect(result.description).toBeNull();
    });

    it('throws NotFoundError when world does not exist', async () => {
      // Arrange
      mockFindById.mockImplementation(() => Promise.resolve(null));

      // Act & Assert
      expect(
        useCase.execute({
          id: testWorldId,
          name: 'New Name',
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('throws ConflictError when new name already exists', async () => {
      // Arrange
      mockExistsByName.mockImplementation(() => Promise.resolve(true));

      // Act & Assert
      expect(
        useCase.execute({
          id: testWorldId,
          name: 'Taken Name',
        })
      ).rejects.toThrow(ConflictError);

      expect(mockSave).not.toHaveBeenCalled();
    });

    it('allows keeping the same name (no conflict check)', async () => {
      // The existsByName should exclude the current world
      mockExistsByName.mockImplementation(() => Promise.resolve(false));

      // Act
      const result = await useCase.execute({
        id: testWorldId,
        name: 'Original Name',
      });

      // Assert
      expect(result.name).toBe('Original Name');
      expect(mockExistsByName).toHaveBeenCalledWith('Original Name', testWorldId);
    });

    it('trims whitespace from name', async () => {
      // Act
      const result = await useCase.execute({
        id: testWorldId,
        name: '  Trimmed Name  ',
      });

      // Assert
      expect(result.name).toBe('Trimmed Name');
    });

    it('trims whitespace from description', async () => {
      // Act
      const result = await useCase.execute({
        id: testWorldId,
        description: '  Trimmed description  ',
      });

      // Assert
      expect(result.description).toBe('Trimmed description');
    });
  });
});
