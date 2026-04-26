using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Common;
using GameStore.Entities.Audit;
using GameStore.Entities.Users;

namespace GameStore.Entities.Auth
{
    public class Role : Entity, IAuditable
    {
        public Guid Guid { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public DateTime Created { get; set; } = DateTime.Now;
        public string ModifiedBy { get; set; } = string.Empty;
        public DateTime Modified { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsActive { get; set; } = true;

        public virtual ICollection<UserRole> UserRoles { get; set; } = new HashSet<UserRole>();
    }
}
