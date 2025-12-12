import type { TemplateId, WorldId, PropertyDefinitionId } from '../value-objects/ids';
import { createTemplateId, templateId, worldId } from '../value-objects/ids';

/**
 * Template interface - the public data shape
 */
export interface ITemplate {
  readonly id: TemplateId;
  readonly worldId: WorldId;
  readonly name: string;
  readonly description: string | null;
  readonly propertyDefinitionIds: readonly PropertyDefinitionId[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface TemplatePersistenceRecord {
  id: string;
  worldId: string;
  name: string;
  description: string | null;
  propertyDefinitionIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Template Domain Entity
 * A reusable collection of property definitions for composition into EntityDefinitions
 */
export class Template implements ITemplate {
  private constructor(
    public readonly id: TemplateId,
    public readonly worldId: WorldId,
    private _name: string,
    private _description: string | null,
    private _propertyDefinitionIds: PropertyDefinitionId[],
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(params: {
    worldId: WorldId;
    name: string;
    description?: string;
    propertyDefinitionIds?: PropertyDefinitionId[];
  }): Template {
    const trimmedName = params.name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Template name cannot be empty');
    }

    const now = new Date();
    return new Template(
      createTemplateId(),
      params.worldId,
      trimmedName,
      params.description?.trim() || null,
      params.propertyDefinitionIds ?? [],
      now,
      now
    );
  }

  static fromPersistence(
    record: TemplatePersistenceRecord,
    propertyDefinitionIdMapper: (id: string) => PropertyDefinitionId
  ): Template {
    return new Template(
      templateId(record.id),
      worldId(record.worldId),
      record.name,
      record.description,
      record.propertyDefinitionIds.map(propertyDefinitionIdMapper),
      record.createdAt,
      record.updatedAt
    );
  }

  toPersistence(): TemplatePersistenceRecord {
    return {
      id: this.id,
      worldId: this.worldId,
      name: this._name,
      description: this._description,
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

  get propertyDefinitionIds(): readonly PropertyDefinitionId[] {
    return this._propertyDefinitionIds;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
