using DemoVueJS.DataAccess.Repositories.CommentRepo;
using DemoVueJS.DataAccess.Repositories.PostRepo;

namespace DemoVueJS.DataAccess
{
    public static class RepositoryRegistration
    {
        public static void AddRepositories(this IServiceCollection services)
        {
            services.AddScoped<ICommentRepo, CommentRepo>();
            services.AddScoped<IPostRepo, PostRepo>();
        }
    }
}
