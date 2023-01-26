namespace Resonance.Schema
{
    public interface IPropertyGroupList : IReadOnlyList<PropertyGroup>
    {
        PropertyGroup this[string groupName] { get; }
    }
}