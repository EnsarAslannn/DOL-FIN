using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class AppUser : IdentityUser
    {
        [Column(TypeName = "decimal(18,2)")]
        public decimal WalletBalance { get; set; } = 0m;

        public List<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
    }
}
