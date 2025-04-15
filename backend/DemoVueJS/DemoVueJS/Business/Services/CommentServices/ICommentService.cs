using DemoVueJS.Business.Dtos.Comment;

namespace DemoVueJS.Business.Services.CommentServices
{
    public interface ICommentService
    {
        Task<CommentReadDto> CreateCommentAsync(CommentCreateDto commentCreateDto);
    }
}
