import type { EntityDefinitionId, WorldId, TemplateId, PropertyDefinitionId } from '../shared/ids';
import { createEntityDefinitionId } from '../shared/ids';

/**
 * EntityDefinition interface - the public data shape
 */
export interface IEntityDefinition {
  readonly id: EntityDefinitionId;
  readonly worldId: WorldId;
  readonly name: string;
  readonly description: string | null;
  readonly icon: string | null;
  readonly templateIds: readonly TemplateId[];
  readonly propertyDefinitionIds: readonly PropertyDefinitionId[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * EntityDefinition Domain Entity
 * A schema that defines what properties an entity can have
 */
export class EntityDefinition implements IEntityDefinition {
  private constructor(
    public readonly id: EntityDefinitionId,
    public readonly worldId: WorldId,
    private _name: string,
    private _description: string | null,
    private _icon: string | null,
    private _templateIds: TemplateId[],
    private _propertyDefinitionIds: PropertyDefinitionId[],
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  private static validateName(name: string): string {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('EntityDefinition name cannot be empty');
    }
    return trimmedName;
  }

  /**
   * Create a new EntityDefinition
   * Generates ID and timestamps, validates business rules
   */
  static create(params: {
    worldId: WorldId;
    name: string;
    description?: string;
    icon?: string;
    templateIds?: TemplateId[];
    propertyDefinitionIds?: PropertyDefinitionId[];
  }): EntityDefinition {
    const now = new Date();
    return new EntityDefinition(
      createEntityDefinitionId(),
      params.worldId,
      EntityDefinition.validateName(params.name),
      params.description?.trim() || null,
      params.icon?.trim() || null,
      params.templateIds ?? [],
      params.propertyDefinitionIds ?? [],
      now,
      now
    );
  }

  /**
   * Reconstitute an existing EntityDefinition from stored data
   * Used by adapters when loading from database
   * Validates to ensure data integrity
   */
  static existing(data: IEntityDefinition): EntityDefinition {
    return new EntityDefinition(
      data.id,
      data.worldId,
      EntityDefinition.validateName(data.name),
      data.description?.trim() ?? null,
      data.icon?.trim() ?? null,
      [...data.templateIds],
      [...data.propertyDefinitionIds],
      data.createdAt,
      data.updatedAt
    );
  }

  get name(): string {
    return this._name;
  }

  get description(): string | null {
    return this._description;
  }

  get icon(): string | null {
    return this._icon;
  }

  get templateIds(): readonly TemplateId[] {
    return this._templateIds;
  }

  get propertyDefinitionIds(): readonly PropertyDefinitionId[] {
    return this._propertyDefinitionIds;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
