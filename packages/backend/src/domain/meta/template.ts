import type { TemplateId, WorldId, PropertyDefinitionId } from '../shared/ids';
import { createTemplateId } from '../shared/ids';

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

  private static validateName(name: string): string {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Template name cannot be empty');
    }
    return trimmedName;
  }

  /**
   * Create a new Template
   * Generates ID and timestamps, validates business rules
   */
  static create(params: {
    worldId: WorldId;
    name: string;
    description?: string;
    propertyDefinitionIds?: PropertyDefinitionId[];
  }): Template {
    const now = new Date();
    return new Template(
      createTemplateId(),
      params.worldId,
      Template.validateName(params.name),
      params.description?.trim() || null,
      params.propertyDefinitionIds ?? [],
      now,
      now
    );
  }

  /**
   * Reconstitute an existing Template from stored data
   * Used by adapters when loading from database
   * Validates to ensure data integrity
   */
  static existing(data: ITemplate): Template {
    return new Template(
      data.id,
      data.worldId,
      Template.validateName(data.name),
      data.description?.trim() ?? null,
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

  get propertyDefinitionIds(): readonly PropertyDefinitionId[] {
    return this._propertyDefinitionIds;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
