using AutoMapper;
using DemoVueJS.Business.Dtos.Comment;
using DemoVueJS.DataAccess.Repositories.CommentRepo;
using DemoVueJS.DataAccess.Repositories.PostRepo;
using DemoVueJS.Entities;
using Microsoft.AspNetCore.Identity;

namespace DemoVueJS.Business.Services.CommentServices
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepo _commentRepo;
        private readonly UserManager<User> _userManager;
        private readonly IPostRepo _postRepo;
        private readonly IMapper _mapper;

        public CommentService(
            ICommentRepo commentRepo, 
            IMapper mapper, 
            UserManager<User> userManager,
            IPostRepo postRepo)
        {
            _commentRepo = commentRepo;
            _mapper = mapper;
            _userManager = userManager;
            _postRepo = postRepo;
        }

        public async Task<CommentReadDto> CreateCommentAsync(CommentCreateDto commentCreateDto)
        {

            var user = await _userManager.FindByEmailAsync(commentCreateDto.UserEmail);
            if (user == null)
                throw new Exception("User not found.");

            var post = await _postRepo.GetPostByIdAsync(commentCreateDto.PostId);
            if (post == null)
                throw new Exception("Post not found.");

            var commentEntity = _mapper.Map<Comment>(commentCreateDto);

            commentEntity.Post = post;
            commentEntity.UserId = user.Id;
            commentEntity.User = user;

            var createdComment = await _commentRepo.CreateComment(commentEntity);
            return _mapper.Map<CommentReadDto>(createdComment);
        }
    }
}
