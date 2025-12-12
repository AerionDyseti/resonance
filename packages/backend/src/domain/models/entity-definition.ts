import type {
  EntityDefinitionId,
  WorldId,
  TemplateId,
  PropertyDefinitionId,
} from '../value-objects/ids';
import {
  createEntityDefinitionId,
  entityDefinitionId,
  worldId,
  templateId,
  propertyDefinitionId,
} from '../value-objects/ids';

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

export interface EntityDefinitionPersistenceRecord {
  id: string;
  worldId: string;
  name: string;
  description: string | null;
  icon: string | null;
  templateIds: string[];
  propertyDefinitionIds: string[];
  createdAt: Date;
  updatedAt: Date;
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

  static create(params: {
    worldId: WorldId;
    name: string;
    description?: string;
    icon?: string;
    templateIds?: TemplateId[];
    propertyDefinitionIds?: PropertyDefinitionId[];
  }): EntityDefinition {
    const trimmedName = params.name.trim();
    if (trimmedName.length === 0) {
      throw new Error('EntityDefinition name cannot be empty');
    }

    const now = new Date();
    return new EntityDefinition(
      createEntityDefinitionId(),
      params.worldId,
      trimmedName,
      params.description?.trim() || null,
      params.icon?.trim() || null,
      params.templateIds ?? [],
      params.propertyDefinitionIds ?? [],
      now,
      now
    );
  }

  static fromPersistence(record: EntityDefinitionPersistenceRecord): EntityDefinition {
    return new EntityDefinition(
      entityDefinitionId(record.id),
      worldId(record.worldId),
      record.name,
      record.description,
      record.icon,
      record.templateIds.map(templateId),
      record.propertyDefinitionIds.map(propertyDefinitionId),
      record.createdAt,
      record.updatedAt
    );
  }

  toPersistence(): EntityDefinitionPersistenceRecord {
    return {
      id: this.id,
      worldId: this.worldId,
      name: this._name,
      description: this._description,
      icon: this._icon,
      templateIds: this._templateIds.map((id) => id as string),
      propertyDefinitionIds: this._propertyDefinitionIds.map((id) => id as string),
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
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
