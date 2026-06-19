// GameStore.Entities/Store/OrderDetail.cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GameStore.Entities.Games;

namespace GameStore.Entities.Store;

public class OrderDetail
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int GameId { get; set; }
    public int Quantity { get; set; } = 1;        /// <summary>Đơn giá tại thời điểm mua (VND)</summary>
        public long UnitPrice { get; set; }

    public virtual Order Order { get; set; } = null!;
    public virtual Game Game { get; set; } = null!;
    public virtual ICollection<GameKey> GameKeys { get; set; } = new HashSet<GameKey>();
}
