using DemoVueJS.Entities;

namespace DemoVueJS.DataAccess.Repositories.CommentRepo
{
    public interface ICommentRepo 
    {
        Task<List<Comment>> GetCommentOfPostAsync(Guid PostId);
        Task<Comment> CreateComment(Comment comment);
    }
}
