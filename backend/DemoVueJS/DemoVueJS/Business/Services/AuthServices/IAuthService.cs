using DemoVueJS.Business.Dtos.Auth;
namespace DemoVueJS.Business.Services.AuthServices
{
    public interface IAuthService
    {
        Task<UserReadDto> RegisterAsync(UserCreateDto userCreateDto);
        Task<string> LoginAsync(UserLoginDto userLoginDto);
        Task<string> RenewTokenAsync(string email);
        Task<List<UserReadDto>> GetAllUsers();
    }
}
