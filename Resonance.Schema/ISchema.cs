namespace Resonance.Schema
{
    /// <summary>
    /// A class representing a collection of property groups.
    /// These should be sub-classed, with each subclass creating the correct
    /// property groups, properties, and initializing them so that they are
    /// ready to receive values.
    ///
    /// When an Entity is initialized, changing it's properties should not be
    /// possible, only the values those properties hold.
    ///
    /// For now, the collection of property groups and properties are hard-coded
    /// in the individual entity classes.
    /// TODO: Be able to read an entity's intended structure from a schema file.
    /// </summary>
    public interface ISchema
    {
        /// <summary>
        /// A read-only collection of property groups that can be indexed
        /// by internal name.
        /// </summary>
        public IPropertyGroupList PropertyGroups { get; }
    }
}