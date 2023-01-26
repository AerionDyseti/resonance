using System.Collections.ObjectModel;

namespace Resonance.Schema
{
    // A read-only collection with a custom indexer.
    public class PropertyGroupList : ReadOnlyCollection<PropertyGroup>, IPropertyGroupList
    {
        public PropertyGroupList(IList<PropertyGroup> list) : base(list)
        {
        }

        /// <summary>
        /// Allows the use of `SomeEntity.PropertyGroups['GroupName']`
        /// </summary>
        /// <param name="groupName">the internal name of the group to fetch</param>
        /// <returns>The Property Group with that name.</returns>
        /// <exception cref="ArgumentNullException">groupName must not be null.</exception>
        public PropertyGroup this[string groupName]
        {
            get
            {
                groupName = groupName ?? throw new ArgumentNullException(nameof(groupName));
                return this.First(pg => pg.Name == groupName);
            }
        }
    }
}