using AutoMapper;
using DemoVueJS.Business.Dtos.Auth;
using DemoVueJS.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DemoVueJS.Business.Services.AuthServices
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _configuration;
        private readonly IMapper _mapper;

        public AuthService(UserManager<User> userManager, IConfiguration configuration, IMapper mapper)
        {
            _userManager = userManager;
            _configuration = configuration;
            _mapper = mapper;
        }

        public async Task<UserReadDto> RegisterAsync(UserCreateDto userCreateDto)
        {
            var existingUser = await _userManager.FindByEmailAsync(userCreateDto.Email);
            if (existingUser != null)
            {
                throw new InvalidOperationException("User with this email already exists.");
            }

            var newUser = new User
            {
                UserName = userCreateDto.Email,
                Email = userCreateDto.Email,
                FullName = userCreateDto.FullName
            };

            var result = await _userManager.CreateAsync(newUser, userCreateDto.Password);
            if (!result.Succeeded)
            {
                throw new InvalidOperationException($"User creation failed: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            await _userManager.AddToRoleAsync(newUser, "Customer");

            return new UserReadDto
            {
                Email = newUser.Email,
                FullName = newUser.FullName,
            };
        }

        public async Task<string> LoginAsync(UserLoginDto userLoginDto)
        {
            var user = await _userManager.FindByEmailAsync(userLoginDto.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, userLoginDto.Password))
                throw new UnauthorizedAccessException("Invalid email or password.");

            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in userRoles)
                authClaims.Add(new Claim(ClaimTypes.Role, role));

            var token = GenerateJwtToken(authClaims);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private JwtSecurityToken GenerateJwtToken(List<Claim> claims)
        {
            var key = Encoding.UTF8.GetBytes(_configuration["JWT:Key"]);
            var issuer = _configuration["JWT:Issuer"];
            var audience = _configuration["JWT:Audience"];

            var authSigningKey = new SymmetricSecurityKey(key);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                expires: DateTime.UtcNow.AddSeconds(10),
                claims: claims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return token;
        }


        public async Task<string> RenewTokenAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
                throw new UnauthorizedAccessException("User not found.");

            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in userRoles)
                authClaims.Add(new Claim(ClaimTypes.Role, role));

            var newToken = GenerateJwtToken(authClaims);

            return new JwtSecurityTokenHandler().WriteToken(newToken);
        }

        public async Task<List<UserReadDto>> GetAllUsers()
        {
            var result = await _userManager.Users.ToListAsync();
            return _mapper.Map<List<UserReadDto>>(result);
        }
    }
}
