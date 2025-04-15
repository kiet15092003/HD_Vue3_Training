namespace DemoVueJS.Entities
{
    public class PagedParams
    {
        public int page { get; set; } = 1;
        public int pageSize { get; set; } = 9;
        public string? search { get; set; } = string.Empty;
        public DateTime? startDate { get; set; }
        public DateTime? endDate { get; set; }
    }
}
