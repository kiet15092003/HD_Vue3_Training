using DemoVueJS.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DemoVueJS.DataAccess
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }
        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is Post || e.Entity is Comment)
                .Where(e => e.State == EntityState.Added);

            foreach (var entry in entries)
            {
                if (entry.Entity is Post post)
                {
                    post.CreatedAt = DateTime.UtcNow;
                }
                else if (entry.Entity is Comment comment)
                {
                    comment.CreatedAt = DateTime.UtcNow;
                }
            }
        }
    }
}
