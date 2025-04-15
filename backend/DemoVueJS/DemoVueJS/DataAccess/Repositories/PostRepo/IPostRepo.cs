using DemoVueJS.Entities;

namespace DemoVueJS.DataAccess.Repositories.PostRepo
{
    public interface IPostRepo
    {
        Task<Post> CreatePostAsync(Post post);
        Task<List<Post>> GetAllPost();
        Task<Post> GetPostByIdAsync(Guid id);
        Task<Post> DeactivePostAsync(Guid id);
        Task<Post> EditPostAsync(Post post);
        Task<(List<Post>, int)> GetAllPost(int page, int pageSize, string search, DateTime? startDate = null, DateTime? endDate = null);
    }
}
