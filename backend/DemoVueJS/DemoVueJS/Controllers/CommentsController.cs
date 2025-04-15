using DemoVueJS.Business.Dtos.Comment;
using DemoVueJS.Business.Dtos.Post;
using DemoVueJS.Business.Services.CommentServices;
using DemoVueJS.Middlewares;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DemoVueJS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentsController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpPost]
        public async Task<ApiResponse<CommentReadDto>> CreatePost([FromBody] CommentCreateDto commentCreateDto)
        {
            var createdComment = await _commentService.CreateCommentAsync(commentCreateDto);
            return ApiResponse<CommentReadDto>.SuccessResponse(createdComment);
        }
    }
}
