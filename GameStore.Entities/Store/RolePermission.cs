// GameStore.Entities/Store/RolePermission.cs
using System;
using GameStore.Entities.Auth;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.Entities.Store
{
    public class RolePermission
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string Permission { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual Role Role { get; set; } = null!;
    }
}
