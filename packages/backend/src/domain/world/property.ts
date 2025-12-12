import type { PropertyId, PropertyDefinitionId, TemplateId } from '../shared/ids';
import { createPropertyId } from '../shared/ids';

/**
 * PropertyValue - The actual value stored for a property
 */
export type PropertyValue = string | number | boolean | string[] | null;

/**
 * Property interface - the public data shape
 */
export interface IProperty {
  readonly id: PropertyId;
  readonly definitionId: PropertyDefinitionId;
  readonly value: PropertyValue;
  readonly sourceTemplateId: TemplateId | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Property Domain Entity
 * An instance of a PropertyDefinition with a specific value
 * Owned by Entity or Relationship aggregates
 */
export class Property implements IProperty {
  private constructor(
    public readonly id: PropertyId,
    public readonly definitionId: PropertyDefinitionId,
    private _value: PropertyValue,
    public readonly sourceTemplateId: TemplateId | null,
    public readonly createdAt: Date,
    private _updatedAt: Date
  ) {}

  /**
   * Create a new Property
   * Generates ID and timestamps
   */
  static create(params: {
    definitionId: PropertyDefinitionId;
    value: PropertyValue;
    sourceTemplateId?: TemplateId;
  }): Property {
    const now = new Date();
    return new Property(
      createPropertyId(),
      params.definitionId,
      params.value,
      params.sourceTemplateId ?? null,
      now,
      now
    );
  }

  /**
   * Reconstitute an existing Property from stored data
   * Used by adapters when loading from database
   */
  static existing(data: IProperty): Property {
    return new Property(
      data.id,
      data.definitionId,
      data.value,
      data.sourceTemplateId,
      data.createdAt,
      data.updatedAt
    );
  }

  get value(): PropertyValue {
    return this._value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
