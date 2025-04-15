using DemoVueJS.Business.Dtos.Comment;

namespace DemoVueJS.Business.Dtos.Post
{
    public class PostReadDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public List<CommentReadDto> Comments { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
