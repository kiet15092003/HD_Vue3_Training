using DemoVueJS.Business.Dtos.Post;
using DemoVueJS.Business.Services.PostServices;
using DemoVueJS.Entities;
using DemoVueJS.Middlewares;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DemoVueJS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PostsController : ControllerBase
    {
        private readonly IPostService _postService;

        public PostsController(IPostService postService)
        {
            _postService = postService;
        }

        [HttpGet]
        public async Task<ApiResponse<PagedResult<PostReadDto>>> GetAllPosts([FromQuery] PagedParams query)
        {
            var posts = await _postService.GetAllPostAsync(query.page, query.pageSize, query.search!, query.startDate, query.endDate);
            return ApiResponse<PagedResult<PostReadDto>>.SuccessResponse(posts);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<PostReadDto>> CreatePost([FromBody] PostCreateDto postCreateDto)
        {
            var createdPost = await _postService.CreatePostAsync(postCreateDto);
            return ApiResponse<PostReadDto>.SuccessResponse(createdPost);
        }

        [HttpPut("deactivate/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<PostReadDto>> DeactivatePost([FromRoute] Guid id)
        {
            var deactivatedPost = await _postService.DeactivePostAsync(id);
            return ApiResponse<PostReadDto>.SuccessResponse(deactivatedPost);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ApiResponse<PostReadDto>> EditPost([FromRoute] Guid id, [FromBody] PostEditDto postEditDto)
        {
            var updatedPost = await _postService.EditPostAsync(id, postEditDto);
            return ApiResponse<PostReadDto>.SuccessResponse(updatedPost);
        }
    }
}
