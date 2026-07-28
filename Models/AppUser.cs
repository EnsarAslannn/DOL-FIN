using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class AppUser : IdentityUser
    {
        // AccountController.Register always sets this explicitly to 0 on
        // creation, so this default only ever applies to an AppUser
        // constructed outside that flow (e.g. tests) -- kept at 0 so it
        // can't silently diverge from actual registration behavior again.
        [Column(TypeName = "decimal(18,2)")]
        public decimal WalletBalance { get; set; } = 0m;

        public List<Portfolio> Portfolios { get; set; } = new List<Portfolio>();
    }
}
