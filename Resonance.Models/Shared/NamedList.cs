namespace Resonance.Models.Shared
{
    public class NamedList<T> : List<T> where T : INamed
    {
        // Access an element using it's name, i.e.:
        //  entity.propertyGroups["property-group-I"]
        // or
        //  propertyGroup.Properties["property-a"]
        public T? this[string name]
        {
            get => this.FirstOrDefault(x => x.Name == name);
        }
    }
}