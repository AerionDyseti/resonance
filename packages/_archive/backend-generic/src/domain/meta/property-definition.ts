import type { PropertyDefinitionId, WorldId, EntityDefinitionId } from '../shared/ids';
import { createPropertyDefinitionId } from '../shared/ids';

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

  private static validateName(name: string): string {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      throw new Error('Property name cannot be empty');
    }
    return trimmedName;
  }

  /**
   * Create a new PropertyDefinition
   * Generates ID and timestamps, validates business rules
   */
  static create(params: {
    worldId: WorldId;
    name: string;
    type: PropertyType;
    description?: string;
    required?: boolean;
    defaultValue?: PropertyValue;
    constraints?: PropertyConstraints;
  }): PropertyDefinition {
    const now = new Date();
    return new PropertyDefinition(
      createPropertyDefinitionId(),
      params.worldId,
      PropertyDefinition.validateName(params.name),
      params.type,
      params.description?.trim() || null,
      params.required ?? false,
      params.defaultValue ?? null,
      params.constraints ?? null,
      now,
      now
    );
  }

  /**
   * Reconstitute an existing PropertyDefinition from stored data
   * Used by adapters when loading from database
   * Validates to ensure data integrity
   */
  static existing(data: IPropertyDefinition): PropertyDefinition {
    return new PropertyDefinition(
      data.id,
      data.worldId,
      PropertyDefinition.validateName(data.name),
      data.type,
      data.description?.trim() ?? null,
      data.required,
      data.defaultValue,
      data.constraints ? { ...data.constraints } : null,
      data.createdAt,
      data.updatedAt
    );
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
