namespace DemoVueJS.Entities
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }

        public bool HasNextPage => (PageNumber * PageSize) < TotalCount;
        public bool HasPreviousPage => PageNumber > 1;
    }
}
