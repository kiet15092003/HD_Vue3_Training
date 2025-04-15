using DemoVueJS.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace DemoVueJS.DataAccess
{
    public static class PrepDb
    {
        public static async Task PrepPopulationAsync(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<AppDbContext>();
                var roleManager = serviceScope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<User>>();
                await SeedDataAsync(context, roleManager, userManager);
            }
        }

        private static async Task SeedDataAsync(AppDbContext context, RoleManager<IdentityRole> roleManager, UserManager<User> userManager)
        {

            Console.WriteLine("--- Applying migrations ---");
            try
            {
                await context.Database.MigrateAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"--- Apply migration failed: {ex.Message} ---");
            }
            await SeedRolesAsync(roleManager);
            await SeedAdminAccountAsync(userManager);
        }

        private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roles = { "Admin", "Customer" };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));

                    Console.WriteLine($"Seeded role: {role}");
                }
            }
        }
        private static async Task SeedAdminAccountAsync(UserManager<User> userManager)
        {
            string adminEmail = "adminweb@example.com"; 
            string adminPassword = "Admin@123";

            var existingAdmin = await userManager.FindByEmailAsync(adminEmail);

            if (existingAdmin == null)
            {
                var adminUser = new User
                {
                    UserName = "adminweb@example.com",
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FullName = "Admin"
                };

                var result = await userManager.CreateAsync(adminUser, adminPassword);

                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                    Console.WriteLine($"Seeded admin account: {adminUser.UserName}");
                }
                else
                {
                    Console.WriteLine($"Failed to create admin account: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
        }
    }
}