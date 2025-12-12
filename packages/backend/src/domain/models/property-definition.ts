import type { PropertyDefinitionId, WorldId, EntityDefinitionId } from '../value-objects/ids';
import { createPropertyDefinitionId, propertyDefinitionId, worldId } from '../value-objects/ids';

/**
 * Supported property types
 */
export enum PropertyType {
  Text = 'text',
  LongText = 'long_text',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  Select = 'select',
  MultiSelect = 'multi_select',
  Reference = 'reference',
  CreatedTime = 'created_time',
  UpdatedTime = 'updated_time',
}

/**
 * Type-specific validation rules
 */
export interface PropertyConstraints {
  minValue?: number;
  maxValue?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  options?: string[];
  referencedEntityDefinitionId?: EntityDefinitionId;
}

/**
 * The actual value stored for a property
 */
export type PropertyValue = string | number | boolean | string[] | null;

/**
 * PropertyDefinition interface - the public data shape
 */
export interface IPropertyDefinition {
  readonly id: PropertyDefinitionId;
  readonly worldId: WorldId;
  readonly name: string;
  readonly type: PropertyType;
  readonly description: string | null;
  readonly required: boolean;
  readonly defaultValue: PropertyValue;
  readonly constraints: PropertyConstraints | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface PropertyDefinitionPersistenceRecord {
  id: string;
  worldId: string;
  name: string;
  type: string;
  description: string | null;
  required: boolean;
  defaultValue: PropertyValue;
  constraints: PropertyConstraints | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * PropertyDefinition Domain Entity
 * A reusable field definition that can be used across entity types
 */
export class PropertyDefinition implements IPropertyDefinition {
  private constructor(
    public readonly id: PropertyDefinitionId,
    public readonly worldId: WorldId,
    private _name: string,
    private _type: PropertyType,
    private _description: string | null,
    private _required: boolean,
    private _defaultValue: PropertyValue,
    private _constraints: PropertyConstraints | null,
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  static create(params: {
    worldId: WorldId;
    name: string;
    type: PropertyType;
    description?: string;
    required?: boolean;
    defaultValue?: PropertyValue;
    constraints?: PropertyConstraints;
  }): PropertyDefinition {
    const trimmedName = params.name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Property name cannot be empty');
    }

    const now = new Date();
    return new PropertyDefinition(
      createPropertyDefinitionId(),
      params.worldId,
      trimmedName,
      params.type,
      params.description?.trim() || null,
      params.required ?? false,
      params.defaultValue ?? null,
      params.constraints ?? null,
      now,
      now
    );
  }

  static fromPersistence(record: PropertyDefinitionPersistenceRecord): PropertyDefinition {
    return new PropertyDefinition(
      propertyDefinitionId(record.id),
      worldId(record.worldId),
      record.name,
      record.type as PropertyType,
      record.description,
      record.required,
      record.defaultValue,
      record.constraints,
      record.createdAt,
      record.updatedAt
    );
  }

  toPersistence(): PropertyDefinitionPersistenceRecord {
    return {
      id: this.id,
      worldId: this.worldId,
      name: this._name,
      type: this._type,
      description: this._description,
      required: this._required,
      defaultValue: this._defaultValue,
      constraints: this._constraints,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }

  get name(): string {
    return this._name;
  }

  get type(): PropertyType {
    return this._type;
  }

  get description(): string | null {
    return this._description;
  }

  get required(): boolean {
    return this._required;
  }

  get defaultValue(): PropertyValue {
    return this._defaultValue;
  }

  get constraints(): PropertyConstraints | null {
    return this._constraints;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
