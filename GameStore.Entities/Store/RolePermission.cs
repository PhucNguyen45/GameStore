using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Auth;

namespace GameStore.Entities.Store
{
    public class RolePermission
    {
        public int Id { get; set; }
        public int RoleId { get; set; }
        public string Permission { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public virtual Role Role { get; set; } = null!;
    }
}
