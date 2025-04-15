namespace DemoVueJS.Business.Dtos.Comment
{
    public class CommentCreateDto
    {
        public string Content { get; set; }
        public Guid PostId { get; set; }
        public string UserEmail { get; set; }
    }
}
