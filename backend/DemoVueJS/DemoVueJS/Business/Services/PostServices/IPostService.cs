using DemoVueJS.Business.Dtos.Post;
using DemoVueJS.Entities;

namespace DemoVueJS.Business.Services.PostServices
{
    public interface IPostService
    {
        Task<PostReadDto> CreatePostAsync(PostCreateDto postCreateDto);
        Task<PostReadDto> DeactivePostAsync(Guid id);
        Task<PostReadDto> EditPostAsync(Guid id, PostEditDto post);
        Task<PagedResult<PostReadDto>> GetAllPostAsync(int page, int pageSize, string search, DateTime? startDate = null, DateTime? endDate = null);
    }
}
