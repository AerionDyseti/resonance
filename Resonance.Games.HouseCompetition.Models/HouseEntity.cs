using Resonance.Schema;
using Resonance.Schema.Properties;
using Resonance.Utilities.Extensions;

namespace Resonance.Games.HouseCompetition.Models
{
    // TODO: Build a factory class that uses reflection to
    // Automatically generate Entity classes from a provided POCO?
    public class HouseEntity : IEntity
    {
        private static readonly List<PropertyGroup> _propertyGroups = new()
            {
                new PropertyGroup(
                    nameof(House.Details).ToSnakeCasing(),
                    nameof(House.Details)
                )
                {
                    Properties = new List<IProperty>()
                    {
                        new TextProperty(
                            nameof(House.Details.Name).ToSnakeCasing(),
                            nameof(House.Details.Name)
                        ),
                        new TextProperty(
                            nameof(House.Details.Motto).ToSnakeCasing(),
                            nameof(House.Details.Motto)
                        )
                    }
                }
            };

        /// <summary>
        /// A very simple test entity representing a group of people.
        /// It has one property groups, with two properties: name and house motto.
        public HouseEntity()
        {
            Id = Guid.NewGuid();
            CreationDate = DateTime.Now;
            DeletionDate = null;
            PropertyGroups = new PropertyGroupList(_propertyGroups);
        }

        public IPropertyGroupList PropertyGroups { get; }
        public Guid Id { get; }
        public DateTime CreationDate { get; }
        public DateTime? DeletionDate { get; }
    }
}