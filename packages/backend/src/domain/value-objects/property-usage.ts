/**
 * PropertyUsage - Value object representing a {{property}} reference in body content
 * Extracted from markdown body for tracking which properties are used in content
 */
export interface PropertyUsage {
  /** The property name referenced (e.g., "age" from {{age}}) */
  propertyName: string;
  /** Character offset in the body where this reference starts */
  startOffset: number;
  /** Character offset in the body where this reference ends */
  endOffset: number;
}
