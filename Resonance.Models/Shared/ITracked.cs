namespace Resonance.Models.Shared
{
    public interface ITracked
    {
        public Guid Id { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime? DeletionDate { get; set; }
    }
}