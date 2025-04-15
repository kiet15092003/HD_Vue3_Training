using AutoMapper;
using DemoVueJS.Business.Dtos.Post;
using DemoVueJS.DataAccess.Repositories.PostRepo;
using DemoVueJS.Entities;

namespace DemoVueJS.Business.Services.PostServices
{
    public class PostService : IPostService
    {
        private readonly IPostRepo _postRepo;
        private readonly IMapper _mapper;
        public PostService(IPostRepo postRepo, IMapper mapper)
        {
            _postRepo = postRepo;
            _mapper = mapper;
        }

        public async Task<PostReadDto> CreatePostAsync(PostCreateDto postCreateDto)
        {
            var postEntity = _mapper.Map<Post>(postCreateDto);
            var result = await _postRepo.CreatePostAsync(postEntity);
            return _mapper.Map<PostReadDto>(result);
        }

        public async Task<PostReadDto> DeactivePostAsync(Guid id)
        {
            var result = await _postRepo.DeactivePostAsync(id);
            return _mapper.Map<PostReadDto>(result);
        }

        public async Task<PostReadDto> EditPostAsync(Guid id, PostEditDto post)
        {
            var postEntity = _mapper.Map<Post>(post);
            postEntity.Id = id;
            var result = await _postRepo.EditPostAsync(postEntity);
            return _mapper.Map<PostReadDto>(result);
        }

        public async Task<PagedResult<PostReadDto>> GetAllPostAsync(int page, int pageSize, string search, DateTime? startDate = null, DateTime? endDate = null)
        {
            var (posts, totalCount) = await _postRepo.GetAllPost(page, pageSize, search, startDate, endDate);

            var mappedPosts = _mapper.Map<List<PostReadDto>>(posts);

            return new PagedResult<PostReadDto>
            {
                Items = mappedPosts,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }
    }
}
