using DemoVueJS.Business.Services.AuthServices;
using DemoVueJS.Business.Services.CommentServices;
using DemoVueJS.Business.Services.PostServices;

namespace DemoVueJS.Business
{
    public static class ServiceRegistration
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<IPostService, PostService>();
        }
    }
}
