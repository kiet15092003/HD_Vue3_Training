using DemoVueJS.Entities;
using Microsoft.EntityFrameworkCore;

namespace DemoVueJS.DataAccess.Repositories.CommentRepo
{
    public class CommentRepo : ICommentRepo
    {
        private readonly AppDbContext _appDbContext;
        public CommentRepo(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<Comment> CreateComment(Comment comment)
        {
            await _appDbContext.Comments.AddAsync(comment);
            await _appDbContext.SaveChangesAsync();
            return comment;
        }

        public async Task<List<Comment>> GetCommentOfPostAsync(Guid postId)
        {
            var comments = await _appDbContext.Comments
                .Where(c => c.PostId == postId)
                .Include(c => c.User)
                .ToListAsync();

            return comments;
        }
    }
}
