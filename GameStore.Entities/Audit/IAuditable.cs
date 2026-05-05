// GameStore.Entities/Audit/IAuditable.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GameStore.Entities.Audit
{
    public interface IAuditable
    {
        string CreatedBy { get; set; }
        DateTime Created { get; set; }
        string ModifiedBy { get; set; }
        DateTime Modified { get; set; }
        bool IsDeleted { get; set; }
    }
}
