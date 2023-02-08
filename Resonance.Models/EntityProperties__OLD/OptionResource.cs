namespace Resonance.Models.EntityProperties
{
    public class OptionResource
    {
        public IEnumerable<string> Options {get;set; } = new List<string>();
        public IEnumerable<string>? Values {get;set; }
        public int? Minimum { get; set; }
        public int? Maximum { get; set; }
    }
}
