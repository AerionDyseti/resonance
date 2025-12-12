import type { PropertyId, PropertyDefinitionId, TemplateId } from '../value-objects/ids';
import {
  createPropertyId,
  propertyId,
  propertyDefinitionId,
  templateId,
} from '../value-objects/ids';

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

export interface PropertyPersistenceRecord {
  id: string;
  definitionId: string;
  value: PropertyValue;
  sourceTemplateId: string | null;
  createdAt: Date;
  updatedAt: Date;
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

  static fromPersistence(record: PropertyPersistenceRecord): Property {
    return new Property(
      propertyId(record.id),
      propertyDefinitionId(record.definitionId),
      record.value,
      record.sourceTemplateId ? templateId(record.sourceTemplateId) : null,
      record.createdAt,
      record.updatedAt
    );
  }

  toPersistence(): PropertyPersistenceRecord {
    return {
      id: this.id,
      definitionId: this.definitionId,
      value: this._value,
      sourceTemplateId: this.sourceTemplateId as string | null,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt,
    };
  }

  get value(): PropertyValue {
    return this._value;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }
}
