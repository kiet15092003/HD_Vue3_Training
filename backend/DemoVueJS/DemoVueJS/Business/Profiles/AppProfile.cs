using AutoMapper;
using DemoVueJS.Business.Dtos.Auth;
using DemoVueJS.Business.Dtos.Comment;
using DemoVueJS.Business.Dtos.Post;
using DemoVueJS.Entities;

namespace DemoVueJS.Business.Profiles
{
    public class AppProfile : Profile
    {
        public AppProfile()
        {
            CreateMap<User, UserReadDto>();
            CreateMap<CommentCreateDto, Comment>()
                .ForMember(dest => dest.Content, opt => opt.MapFrom(src => src.Content))
                .ForMember(dest => dest.PostId, opt => opt.MapFrom(src => src.PostId));
            CreateMap<Comment, CommentReadDto>();
            CreateMap<PostCreateDto, Post>();
            CreateMap<Post, PostReadDto>();
            CreateMap<PostEditDto, Post>();
        }
    }
}
