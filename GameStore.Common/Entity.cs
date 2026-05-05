// GameStore.Common/Entity.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.Common
{
    public class Entity
    {
        public int Id { get; set; }
        public DateTime CreatedDateTime { get; set; } = DateTime.UtcNow;
        public string CreatedUser { get; set; } = string.Empty;
    }
}
