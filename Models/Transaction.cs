using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    [Table("Transactions")]
    public class Transaction
    {
        public int Id { get; set; }
        public string AppUserId { get; set; } = string.Empty;
        public string Symbol { get; set; } = string.Empty;
        public string CompanyName { get; set; } = string.Empty;
        public string TransactionType { get; set; } = string.Empty;

        public int Quantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public AppUser? AppUser { get; set; }
    }
}