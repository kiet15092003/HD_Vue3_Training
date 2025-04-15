using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace DemoVueJS.Entities
{
    public class User : IdentityUser
    {
        [Required]
        public string FullName { get; set; }
        public List<Comment> Comments { get; set; }
    }
}
