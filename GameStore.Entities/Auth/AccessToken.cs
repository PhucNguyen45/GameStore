// GameStore.Entities/Auth/AccessToken.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Common;
using GameStore.Entities.Users;

namespace GameStore.Entities.Auth
{
    public class AccessToken : Entity
    {
        public Guid Guid { get; set; } = Guid.NewGuid();
        public int UserId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime Expirated { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime Created { get; set; } = DateTime.UtcNow;

        public virtual User User { get; set; } = null!;
    }
}
