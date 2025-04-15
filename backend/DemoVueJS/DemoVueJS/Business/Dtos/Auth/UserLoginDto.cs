using System.ComponentModel.DataAnnotations;

namespace DemoVueJS.Business.Dtos.Auth
{
    public class UserLoginDto
    {
        [Required, EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(16, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 16 characters.")]
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$",
                ErrorMessage = "Password must contain at least one letter, one number, and one special character.")]
        public string Password { get; set; }
    }
}
