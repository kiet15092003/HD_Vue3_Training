using System.ComponentModel.DataAnnotations;

namespace DemoVueJS.Entities
{
    public class Post
    {
        [Required]
        public Guid Id { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public string Body { get; set; }
        [Required]
        public bool IsActive { get; set; } = true;
        public List<Comment> Comments { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
    }
}
