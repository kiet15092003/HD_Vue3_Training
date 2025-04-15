using DemoVueJS.Business.Dtos.Auth;

namespace DemoVueJS.Business.Dtos.Comment
{
    public class CommentReadDto
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public UserReadDto User { get; set; }
    }
}
