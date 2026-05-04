// GameStore.Entities/Users/UserRole.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Common;
using GameStore.Entities.Audit;
using GameStore.Entities.Auth;

namespace GameStore.Entities.Users
{
    public class UserRole : Entity, IAuditable
    {
        public Guid Guid { get; set; } = Guid.NewGuid();
        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime Created { get; set; } = DateTime.Now;
        public string ModifiedBy { get; set; } = string.Empty;
        public DateTime Modified { get; set; }
        public bool IsDeleted { get; set; }

        public virtual User User { get; set; } = null!;
        public virtual Role Role { get; set; } = null!;
    }
}
