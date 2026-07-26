using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("Portfolios")]
    public class Portfolio
    {
        public int Id { get; set; }

        public required string AppUserId { get; set; }

        public int StockId { get; set; }

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal AveragePrice { get; set; }

        public AppUser AppUser { get; set; } = default!;

        public Stock Stock { get; set; } = default!;
    }
}
