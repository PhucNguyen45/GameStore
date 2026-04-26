using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace GameStore.Common.Auth;

public static class TokenHelper
{
    public static string HashPassword(string password, out byte[] salt)
    {
        salt = new byte[16];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(salt);

        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256);
        return Convert.ToBase64String(pbkdf2.GetBytes(32));
    }

    public static bool IsValidPassword(string password, byte[] salt, string hashedPassword)
    {
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, 100000, HashAlgorithmName.SHA256);
        return Convert.ToBase64String(pbkdf2.GetBytes(32)) == hashedPassword;
    }

    public static string GenerateToken(string secretKey, int expireMinutes, string userId, string username, string role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secretKey);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, userId),
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, role)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(expireMinutes),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
