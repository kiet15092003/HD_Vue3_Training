using DemoVueJS.Entities;
using Microsoft.EntityFrameworkCore;

namespace DemoVueJS.DataAccess.Repositories.PostRepo
{
    public class PostRepo : IPostRepo
    {
        private readonly AppDbContext _appDbContext;

        public PostRepo(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public async Task<Post> CreatePostAsync(Post post)
        {
            await _appDbContext.Posts.AddAsync(post);
            await _appDbContext.SaveChangesAsync();
            return post;
        }

        public async Task<Post> DeactivePostAsync(Guid id)
        {
            var post = await _appDbContext.Posts.FirstOrDefaultAsync(p => p.Id == id);
            if (post == null)
            {
                throw new KeyNotFoundException("Post not found");
            }
            post.IsActive = false;
            await _appDbContext.SaveChangesAsync();
            return post;
        }

        public async Task<Post> EditPostAsync(Post updatedPost)
        {
            var post = await _appDbContext.Posts.FirstOrDefaultAsync(p => p.Id == updatedPost.Id);
            if (post == null)
            {
                throw new KeyNotFoundException("Post not found");
            }

            post.Title = updatedPost.Title;
            post.Body = updatedPost.Body;

            await _appDbContext.SaveChangesAsync();

            return post;
        }

        public async Task<List<Post>> GetAllPost()
        {
            return await _appDbContext.Posts
                .Where(p => p.IsActive)
                .Include(p => p.Comments)
                .ThenInclude(c => c.User)
                .ToListAsync();
        }

        public async Task<(List<Post>, int)> GetAllPost(int page, int pageSize, string search, DateTime? startDate, DateTime? endDate)
        {
            var query = _appDbContext.Posts.AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(p => p.Title.Contains(search) || p.Title.Contains(search));
            }

            if (startDate.HasValue)
            {
                query = query.Where(p => p.CreatedAt >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                query = query.Where(p => p.CreatedAt <= endDate.Value);
            }

            var totalCount = await query.CountAsync();

            var posts = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (posts, totalCount);
        }


        public async Task<Post> GetPostByIdAsync(Guid id)
        {
            return await _appDbContext.Posts.FirstOrDefaultAsync(p => p.Id == id);
        }
    }
}
