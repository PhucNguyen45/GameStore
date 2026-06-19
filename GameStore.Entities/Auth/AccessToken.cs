// GameStore.Entities/Auth/AccessToken.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Audit;
using GameStore.Entities.Users;

namespace GameStore.Entities.Auth
{
    public class AccessToken : IAuditable
    {
        public int Id { get; set; }
        public Guid Guid { get; set; } = Guid.NewGuid();
        public int UserId { get; set; }
        public string Token { get; set; } = string.Empty;
        public DateTime Expirated { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime Created { get; set; } = DateTime.UtcNow;
        public string ModifiedBy { get; set; } = string.Empty;
        public DateTime Modified { get; set; }
        public bool IsDeleted { get; set; }

        public virtual User User { get; set; } = null!;
    }
}
