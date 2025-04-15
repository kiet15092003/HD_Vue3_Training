using System.ComponentModel.DataAnnotations;

namespace DemoVueJS.Entities
{
    public class Comment
    {
        public Guid Id { get; set; }
        [Required]
        public string Content { get; set; }
        [Required]
        public Guid PostId { get; set; }
        public Post Post { get; set; }
        [Required]
        public string UserId { get; set; }
        public User User { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
    }
}
