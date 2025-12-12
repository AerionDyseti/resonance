import { describe, it, expect } from 'bun:test';
import {
  WorldSchema,
  CreateWorldInput,
  UpdateWorldInput,
  EntityDefinitionSchema,
  CreateEntityDefinitionInput,
  UpdateEntityDefinitionInput,
  EntitySchema,
  CreateEntityInput,
  UpdateEntityInput,
  PropertyConstraintsSchema,
  PropertyDefinitionSchema,
  CreatePropertyDefinitionInput,
  UpdatePropertyDefinitionInput,
  PropertyValueSchema,
  RelationshipSchema,
  CreateRelationshipInput,
  UpdateRelationshipInput,
  PaginationInput,
  SearchInput,
} from './schemas';
import { PropertyType } from '@resonance/shared';

// ========== World Schemas ==========

describe('WorldSchema', () => {
  describe('valid inputs', () => {
    it('should accept a valid world object', () => {
      const validWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My World',
        description: 'A magical world',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(validWorld);
      expect(result.success).toBe(true);
    });

    it('should accept world without description', () => {
      const validWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My World',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(validWorld);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid uuid id', () => {
      const invalidWorld = {
        id: 'not-a-uuid',
        name: 'My World',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(invalidWorld);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(invalidWorld);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255 characters', () => {
      const invalidWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'a'.repeat(256),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(invalidWorld);
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 1000 characters', () => {
      const invalidWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My World',
        description: 'a'.repeat(1001),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = WorldSchema.safeParse(invalidWorld);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const invalidWorld = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'My World',
      };

      const result = WorldSchema.safeParse(invalidWorld);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreateWorldInput', () => {
  describe('valid inputs', () => {
    it('should accept valid create input', () => {
      const validInput = {
        name: 'My World',
        description: 'A magical world',
      };

      const result = CreateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept input without optional description', () => {
      const validInput = {
        name: 'My World',
      };

      const result = CreateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept maximum length name and description', () => {
      const validInput = {
        name: 'a'.repeat(255),
        description: 'a'.repeat(1000),
      };

      const result = CreateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty name', () => {
      const invalidInput = {
        name: '',
      };

      const result = CreateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const invalidInput = {
        name: 'a'.repeat(256),
      };

      const result = CreateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 1000', () => {
      const invalidInput = {
        name: 'My World',
        description: 'a'.repeat(1001),
      };

      const result = CreateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing name', () => {
      const invalidInput = {
        description: 'A world',
      };

      const result = CreateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('UpdateWorldInput', () => {
  const id = '123e4567-e89b-12d3-a456-426614174000';

  describe('valid inputs', () => {
    it('should accept update with name only', () => {
      const validInput = {
        id,
        name: 'Updated World',
      };

      const result = UpdateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with description only', () => {
      const validInput = {
        id,
        description: 'Updated description',
      };

      const result = UpdateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with null description', () => {
      const validInput = {
        id,
        description: null,
      };

      const result = UpdateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with both fields', () => {
      const validInput = {
        id,
        name: 'Updated World',
        description: 'Updated description',
      };

      const result = UpdateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with only id', () => {
      const validInput = { id };

      const result = UpdateWorldInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject missing id', () => {
      const invalidInput = {
        name: 'Updated World',
      };

      const result = UpdateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidInput = {
        id,
        name: '',
      };

      const result = UpdateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const invalidInput = {
        id,
        name: 'a'.repeat(256),
      };

      const result = UpdateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 1000', () => {
      const invalidInput = {
        id,
        description: 'a'.repeat(1001),
      };

      const result = UpdateWorldInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

// ========== Entity Type Schemas ==========

describe('EntityDefinitionSchema', () => {
  const validEntityDefinition = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    worldId: '223e4567-e89b-12d3-a456-426614174000',
    name: 'Character',
    description: 'A character entity type',
    icon: 'person',
    propertyDefinitionIds: ['423e4567-e89b-12d3-a456-426614174000'],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('valid inputs', () => {
    it('should accept valid entity type', () => {
      const result = EntityDefinitionSchema.safeParse(validEntityDefinition);
      expect(result.success).toBe(true);
    });

    it('should accept without optional description and icon', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Character',
        propertyDefinitionIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = EntityDefinitionSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const input = { ...validEntityDefinition, worldId: 'not-uuid' };
      const result = EntityDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const input = { ...validEntityDefinition, name: '' };
      const result = EntityDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const input = { ...validEntityDefinition, name: 'a'.repeat(256) };
      const result = EntityDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid propertyDefinitionId uuid', () => {
      const input = { ...validEntityDefinition, propertyDefinitionIds: ['not-uuid'] };
      const result = EntityDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreateEntityDefinitionInput', () => {
  describe('valid inputs', () => {
    it('should accept valid create input', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Character',
        description: 'A character type',
        icon: 'person',
        propertyDefinitionIds: ['423e4567-e89b-12d3-a456-426614174000'],
      };

      const result = CreateEntityDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should apply default empty array for propertyDefinitionIds', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Character',
      };

      const result = CreateEntityDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.propertyDefinitionIds).toEqual([]);
      }
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const invalidInput = {
        worldId: 'not-uuid',
        name: 'Character',
      };

      const result = CreateEntityDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: '',
      };

      const result = CreateEntityDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing worldId', () => {
      const invalidInput = {
        name: 'Character',
      };

      const result = CreateEntityDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('UpdateEntityDefinitionInput', () => {
  describe('valid inputs', () => {
    it('should accept update with name only', () => {
      const result = UpdateEntityDefinitionInput.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });

    it('should accept update with propertyDefinitionIds', () => {
      const result = UpdateEntityDefinitionInput.safeParse({
        propertyDefinitionIds: ['223e4567-e89b-12d3-a456-426614174000'],
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty update object', () => {
      const result = UpdateEntityDefinitionInput.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty name', () => {
      const result = UpdateEntityDefinitionInput.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid propertyDefinitionId uuid', () => {
      const result = UpdateEntityDefinitionInput.safeParse({
        propertyDefinitionIds: ['not-uuid'],
      });
      expect(result.success).toBe(false);
    });
  });
});

// ========== Property Value Schema ==========

describe('PropertyValueSchema', () => {
  describe('valid inputs', () => {
    it('should accept string value', () => {
      const result = PropertyValueSchema.safeParse('hello');
      expect(result.success).toBe(true);
    });

    it('should accept number value', () => {
      const result = PropertyValueSchema.safeParse(42);
      expect(result.success).toBe(true);
    });

    it('should accept boolean value', () => {
      const result = PropertyValueSchema.safeParse(true);
      expect(result.success).toBe(true);
    });

    it('should accept array of strings', () => {
      const result = PropertyValueSchema.safeParse(['tag1', 'tag2']);
      expect(result.success).toBe(true);
    });

    it('should accept null value', () => {
      const result = PropertyValueSchema.safeParse(null);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject array of numbers', () => {
      const result = PropertyValueSchema.safeParse([1, 2, 3]);
      expect(result.success).toBe(false);
    });

    it('should reject object', () => {
      const result = PropertyValueSchema.safeParse({ key: 'value' });
      expect(result.success).toBe(false);
    });

    it('should reject undefined', () => {
      const result = PropertyValueSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });
});

// ========== Entity Schemas ==========

describe('EntitySchema', () => {
  const validEntity = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    worldId: '223e4567-e89b-12d3-a456-426614174000',
    definitionId: '323e4567-e89b-12d3-a456-426614174000',
    name: 'Aragorn',
    body: '# Character details\nA ranger and king',
    properties: {
      age: 87,
      alignment: 'good',
      tags: ['ranger', 'king'],
    },
    embedding: [0.1, 0.2, 0.3],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('valid inputs', () => {
    it('should accept valid entity', () => {
      const result = EntitySchema.safeParse(validEntity);
      expect(result.success).toBe(true);
    });

    it('should accept entity without embedding', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
        body: 'Character details',
        properties: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should accept empty properties', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
        body: 'Details',
        properties: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const input = { ...validEntity, worldId: 'not-uuid' };
      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const input = { ...validEntity, name: '' };
      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const input = { ...validEntity, name: 'a'.repeat(256) };
      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid property values', () => {
      const input = {
        ...validEntity,
        properties: {
          invalid: { nested: 'object' },
        },
      };

      const result = EntitySchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreateEntityInput', () => {
  describe('valid inputs', () => {
    it('should accept valid create input', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
        body: 'Character details',
        properties: {
          age: 87,
          alignment: 'good',
        },
      };

      const result = CreateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should apply default empty body', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
      };

      const result = CreateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.body).toBe('');
      }
    });

    it('should apply default empty properties', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
      };

      const result = CreateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.properties).toEqual({});
      }
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const invalidInput = {
        worldId: 'not-uuid',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
      };

      const result = CreateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        definitionId: '323e4567-e89b-12d3-a456-426614174000',
        name: '',
      };

      const result = CreateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing definitionId', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Aragorn',
      };

      const result = CreateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('UpdateEntityInput', () => {
  describe('valid inputs', () => {
    it('should accept update with name only', () => {
      const validInput = {
        name: 'Updated Name',
      };

      const result = UpdateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with body only', () => {
      const validInput = {
        body: 'Updated body content',
      };

      const result = UpdateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with properties only', () => {
      const validInput = {
        properties: {
          age: 88,
          alignment: 'neutral',
        },
      };

      const result = UpdateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept update with all fields', () => {
      const validInput = {
        name: 'Updated Name',
        body: 'Updated body',
        properties: { age: 88 },
      };

      const result = UpdateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept empty update object', () => {
      const validInput = {};

      const result = UpdateEntityInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty name', () => {
      const invalidInput = {
        name: '',
      };

      const result = UpdateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const invalidInput = {
        name: 'a'.repeat(256),
      };

      const result = UpdateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject invalid property values', () => {
      const invalidInput = {
        properties: {
          invalid: { nested: 'object' },
        },
      };

      const result = UpdateEntityInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

// ========== Property Constraint Schemas ==========

describe('PropertyConstraintsSchema', () => {
  describe('valid inputs', () => {
    it('should accept numeric constraints', () => {
      const validInput = {
        minValue: 0,
        maxValue: 100,
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept string length constraints', () => {
      const validInput = {
        minLength: 1,
        maxLength: 255,
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept pattern constraint', () => {
      const validInput = {
        pattern: '^[a-zA-Z0-9]+$',
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept select options', () => {
      const validInput = {
        options: ['good', 'neutral', 'evil'],
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept referencedEntityDefinitionId', () => {
      const validInput = {
        referencedEntityDefinitionId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept empty object', () => {
      const validInput = {};

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept combined constraints', () => {
      const validInput = {
        minValue: 0,
        maxValue: 100,
        minLength: 5,
        maxLength: 50,
        pattern: '[0-9]+',
        options: ['A', 'B'],
        referencedEntityDefinitionId: '123e4567-e89b-12d3-a456-426614174000',
      };

      const result = PropertyConstraintsSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject non-numeric minValue', () => {
      const invalidInput = {
        minValue: 'zero',
      };

      const result = PropertyConstraintsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject non-array options', () => {
      const invalidInput = {
        options: 'not-an-array',
      };

      const result = PropertyConstraintsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject non-string pattern', () => {
      const invalidInput = {
        pattern: 123,
      };

      const result = PropertyConstraintsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject invalid referencedEntityDefinitionId uuid', () => {
      const invalidInput = {
        referencedEntityDefinitionId: 'not-uuid',
      };

      const result = PropertyConstraintsSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

// ========== Property Definition Schemas ==========

describe('PropertyDefinitionSchema', () => {
  const validPropertyDefinition = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    worldId: '223e4567-e89b-12d3-a456-426614174000',
    name: 'Age',
    type: PropertyType.Number,
    description: 'Character age',
    required: true,
    defaultValue: 18,
    constraints: {
      minValue: 0,
      maxValue: 1000,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('valid inputs', () => {
    it('should accept valid property definition', () => {
      const result = PropertyDefinitionSchema.safeParse(validPropertyDefinition);
      expect(result.success).toBe(true);
    });

    it('should accept property definition with string type', () => {
      const input = {
        ...validPropertyDefinition,
        type: PropertyType.Text,
        defaultValue: 'default',
      };

      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should accept property definition with select type', () => {
      const input = {
        ...validPropertyDefinition,
        type: PropertyType.Select,
        defaultValue: 'option1',
        constraints: {
          options: ['option1', 'option2', 'option3'],
        },
      };

      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should accept property definition without optional fields', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
        type: PropertyType.Number,
        required: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should accept all property type enum values', () => {
      const types = Object.values(PropertyType);
      types.forEach((type) => {
        const input = {
          ...validPropertyDefinition,
          type,
        };
        const result = PropertyDefinitionSchema.safeParse(input);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const input = { ...validPropertyDefinition, worldId: 'not-uuid' };
      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const input = { ...validPropertyDefinition, name: '' };
      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject name longer than 255', () => {
      const input = { ...validPropertyDefinition, name: 'a'.repeat(256) };
      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid property type', () => {
      const input = { ...validPropertyDefinition, type: 'invalid_type' };
      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject description longer than 1000', () => {
      const input = {
        ...validPropertyDefinition,
        description: 'a'.repeat(1001),
      };

      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject non-boolean required', () => {
      const input = { ...validPropertyDefinition, required: 'yes' };
      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid defaultValue', () => {
      const input = {
        ...validPropertyDefinition,
        defaultValue: { invalid: 'object' },
      };

      const result = PropertyDefinitionSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreatePropertyDefinitionInput', () => {
  describe('valid inputs', () => {
    it('should accept valid create input', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
        type: PropertyType.Number,
        description: 'Character age',
        required: true,
        defaultValue: 18,
        constraints: {
          minValue: 0,
          maxValue: 1000,
        },
      };

      const result = CreatePropertyDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should apply default false for required', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
        type: PropertyType.Number,
      };

      const result = CreatePropertyDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.required).toBe(false);
      }
    });

    it('should accept without optional fields', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
        type: PropertyType.Number,
      };

      const result = CreatePropertyDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept with explicit required true', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Name',
        type: PropertyType.Text,
        required: true,
      };

      const result = CreatePropertyDefinitionInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.required).toBe(true);
      }
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const invalidInput = {
        worldId: 'not-uuid',
        name: 'Age',
        type: PropertyType.Number,
      };

      const result = CreatePropertyDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: '',
        type: PropertyType.Number,
      };

      const result = CreatePropertyDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing type', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
      };

      const result = CreatePropertyDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject invalid property type', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        name: 'Age',
        type: 'invalid',
      };

      const result = CreatePropertyDefinitionInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('UpdatePropertyDefinitionInput', () => {
  describe('valid inputs', () => {
    it('should accept update with name only', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });

    it('should accept update with type only', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({
        type: PropertyType.Text,
      });
      expect(result.success).toBe(true);
    });

    it('should accept update with required only', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({ required: true });
      expect(result.success).toBe(true);
    });

    it('should accept empty update object', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty name', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({ name: '' });
      expect(result.success).toBe(false);
    });

    it('should reject invalid type', () => {
      const result = UpdatePropertyDefinitionInput.safeParse({ type: 'invalid' });
      expect(result.success).toBe(false);
    });
  });
});

// ========== Relationship Schemas ==========

describe('RelationshipSchema', () => {
  const validRelationship = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    worldId: '223e4567-e89b-12d3-a456-426614174000',
    fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
    toEntityId: '423e4567-e89b-12d3-a456-426614174000',
    type: 'parent',
    description: 'A is parent of B',
    metadata: {
      strength: 'strong',
      since: '2024-01-01',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('valid inputs', () => {
    it('should accept valid relationship', () => {
      const result = RelationshipSchema.safeParse(validRelationship);
      expect(result.success).toBe(true);
    });

    it('should accept relationship without optional fields', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should accept various metadata types', () => {
      const input = {
        ...validRelationship,
        metadata: {
          string: 'value',
          number: 42,
          boolean: true,
          array: [1, 'two', true],
          nested: { key: 'value' },
        },
      };

      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const input = { ...validRelationship, worldId: 'not-uuid' };
      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid fromEntityId uuid', () => {
      const input = { ...validRelationship, fromEntityId: 'not-uuid' };
      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject invalid toEntityId uuid', () => {
      const input = { ...validRelationship, toEntityId: 'not-uuid' };
      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty type string', () => {
      const input = { ...validRelationship, type: '' };
      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const input = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = RelationshipSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

describe('CreateRelationshipInput', () => {
  describe('valid inputs', () => {
    it('should accept valid create input', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
        description: 'A is parent of B',
        metadata: {
          strength: 'strong',
        },
      };

      const result = CreateRelationshipInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept without optional fields', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
      };

      const result = CreateRelationshipInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept with only description', () => {
      const validInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
        description: 'A parent-child relationship',
      };

      const result = CreateRelationshipInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject invalid worldId uuid', () => {
      const invalidInput = {
        worldId: 'not-uuid',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
      };

      const result = CreateRelationshipInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject empty type', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        toEntityId: '423e4567-e89b-12d3-a456-426614174000',
        type: '',
      };

      const result = CreateRelationshipInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing toEntityId', () => {
      const invalidInput = {
        worldId: '223e4567-e89b-12d3-a456-426614174000',
        fromEntityId: '323e4567-e89b-12d3-a456-426614174000',
        type: 'parent',
      };

      const result = CreateRelationshipInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('UpdateRelationshipInput', () => {
  describe('valid inputs', () => {
    it('should accept update with type only', () => {
      const result = UpdateRelationshipInput.safeParse({ type: 'ally' });
      expect(result.success).toBe(true);
    });

    it('should accept update with description only', () => {
      const result = UpdateRelationshipInput.safeParse({
        description: 'Updated description',
      });
      expect(result.success).toBe(true);
    });

    it('should accept update with metadata only', () => {
      const result = UpdateRelationshipInput.safeParse({
        metadata: { key: 'value' },
      });
      expect(result.success).toBe(true);
    });

    it('should accept empty update object', () => {
      const result = UpdateRelationshipInput.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty type', () => {
      const result = UpdateRelationshipInput.safeParse({ type: '' });
      expect(result.success).toBe(false);
    });
  });
});

// ========== Query Input Schemas ==========

describe('PaginationInput', () => {
  describe('valid inputs', () => {
    it('should accept valid pagination input', () => {
      const validInput = {
        page: 1,
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should apply default page=1 when missing', () => {
      const validInput = {
        pageSize: 20,
      };

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
      }
    });

    it('should apply default pageSize=10 when missing', () => {
      const validInput = {
        page: 2,
      };

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pageSize).toBe(10);
      }
    });

    it('should apply both defaults when empty object', () => {
      const validInput = {};

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.pageSize).toBe(10);
      }
    });

    it('should accept max pageSize of 100', () => {
      const validInput = {
        page: 1,
        pageSize: 100,
      };

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept large page numbers', () => {
      const validInput = {
        page: 999999,
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject zero page', () => {
      const invalidInput = {
        page: 0,
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject negative page', () => {
      const invalidInput = {
        page: -1,
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject zero pageSize', () => {
      const invalidInput = {
        page: 1,
        pageSize: 0,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject pageSize greater than 100', () => {
      const invalidInput = {
        page: 1,
        pageSize: 101,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject negative pageSize', () => {
      const invalidInput = {
        page: 1,
        pageSize: -10,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject float page number', () => {
      const invalidInput = {
        page: 1.5,
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject float pageSize', () => {
      const invalidInput = {
        page: 1,
        pageSize: 10.5,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric page', () => {
      const invalidInput = {
        page: 'one',
        pageSize: 10,
      };

      const result = PaginationInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe('SearchInput', () => {
  describe('valid inputs', () => {
    it('should accept valid search input', () => {
      const validInput = {
        query: 'aragorn',
        limit: 10,
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should apply default limit=10 when missing', () => {
      const validInput = {
        query: 'aragorn',
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(10);
      }
    });

    it('should accept max limit of 100', () => {
      const validInput = {
        query: 'aragorn',
        limit: 100,
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept query with special characters', () => {
      const validInput = {
        query: 'character_name-123 @special',
        limit: 10,
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept query with spaces', () => {
      const validInput = {
        query: 'aragorn king of gondor',
        limit: 10,
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it('should accept long query', () => {
      const validInput = {
        query: 'a'.repeat(500),
        limit: 10,
      };

      const result = SearchInput.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe('invalid inputs', () => {
    it('should reject empty query string', () => {
      const invalidInput = {
        query: '',
        limit: 10,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject missing query', () => {
      const invalidInput = {
        limit: 10,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject limit of zero', () => {
      const invalidInput = {
        query: 'aragorn',
        limit: 0,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject limit greater than 100', () => {
      const invalidInput = {
        query: 'aragorn',
        limit: 101,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject negative limit', () => {
      const invalidInput = {
        query: 'aragorn',
        limit: -10,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject float limit', () => {
      const invalidInput = {
        query: 'aragorn',
        limit: 10.5,
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric limit', () => {
      const invalidInput = {
        query: 'aragorn',
        limit: 'ten',
      };

      const result = SearchInput.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});
