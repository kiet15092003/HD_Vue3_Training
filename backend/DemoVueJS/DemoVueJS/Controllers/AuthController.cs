using DemoVueJS.Business.Dtos.Auth;
using DemoVueJS.Business.Services.AuthServices;
using DemoVueJS.Entities;
using DemoVueJS.Middlewares;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DemoVueJS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(
            IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ApiResponse<UserReadDto>> Register([FromBody] UserCreateDto userCreateDto)
        {
            var result = await _authService.RegisterAsync(userCreateDto);
            return ApiResponse<UserReadDto>.SuccessResponse(result);
        }

        [HttpPost("login")]
        public async Task<ApiResponse<string>> Login([FromBody] UserLoginDto model)
        {
            var result = await _authService.LoginAsync(model);
            return ApiResponse<string>.SuccessResponse(result);
        }

        [HttpPost("renew-token")]
        public async Task<ApiResponse<string>> ResetToken([FromBody] RenewTokenDto request)
        {
            var result = await _authService.RenewTokenAsync(request.Email);
            return ApiResponse<string>.SuccessResponse(result);
        }
    }
}
