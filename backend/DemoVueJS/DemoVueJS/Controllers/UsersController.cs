using DemoVueJS.Business.Dtos.Auth;
using DemoVueJS.Business.Services.AuthServices;
using DemoVueJS.Middlewares;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DemoVueJS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly IAuthService _authService;

        public UsersController(
            IAuthService authService)
        {
            _authService = authService;
        }

        [HttpGet]
        public async Task<ApiResponse<List<UserReadDto>>> GetAllUsers()
        {
            var posts = await _authService.GetAllUsers();
            return ApiResponse<List<UserReadDto>>.SuccessResponse(posts);
        }
    } 
}
