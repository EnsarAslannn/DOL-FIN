using api.Models;
using Microsoft.AspNetCore.DataProtection.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace api.Data
{
    public class ApplicationDBContext : IdentityDbContext<AppUser>, IDataProtectionKeyContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> dbContextOptions)
            : base(dbContextOptions) { }

        public DbSet<Stock> Stock { get; set; }

        public DbSet<Comment> Comments { get; set; }

        public DbSet<Portfolio> Portfolios { get; set; }

        public DbSet<Transaction> Transactions { get; set; }

        public DbSet<Microsoft.AspNetCore.DataProtection.EntityFrameworkCore.DataProtectionKey> DataProtectionKeys { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Prevents lost updates when two requests for the same user race
            // (e.g. concurrent withdraw/sell): SaveChanges includes the row's
            // xmin (Postgres' built-in row-version system column) in the
            // WHERE clause and throws DbUpdateConcurrencyException if it
            // changed since the entity was read. No data column is added.
            builder.Entity<AppUser>()
                .Property<uint>("xmin")
                .HasColumnName("xmin")
                .HasColumnType("xid")
                .ValueGeneratedOnAddOrUpdate()
                .IsRowVersion();

            builder.Entity<Portfolio>()
                .Property<uint>("xmin")
                .HasColumnName("xmin")
                .HasColumnType("xid")
                .ValueGeneratedOnAddOrUpdate()
                .IsRowVersion();

            builder.Entity<Stock>()
                .HasIndex(s => s.Symbol)
                .IsUnique();

            builder.Entity<Portfolio>()
                .HasKey(p => p.Id);

            builder.Entity<Portfolio>()
                .HasOne(u => u.AppUser)
                .WithMany(u => u.Portfolios)
                .HasForeignKey(p => p.AppUserId);

            builder.Entity<Portfolio>()
                .HasOne(u => u.Stock)
                .WithMany(u => u.Portfolios)
                .HasForeignKey(p => p.StockId);

            List<IdentityRole> roles = new List<IdentityRole>
            {
                new IdentityRole
                {
                    Id = "c89b788a-3642-47df-bc6c-13654b03517c",
                    Name = "Admin",
                    NormalizedName = "ADMIN",
                    // Pinned to the value already persisted by the InitialCreate
                    // migration. IdentityRole.ConcurrencyStamp defaults to a new
                    // Guid per instance, which made the model non-deterministic
                    // across builds (EF flagged pending changes on every
                    // migrations/database-update run) -- must stay static.
                    ConcurrencyStamp = "180dc409-91b3-4204-ac43-5c253ce4fad3",
                },
                new IdentityRole
                {
                    Id = "e2d83ab9-2bb6-46b6-b8db-4e115fa016b2",
                    Name = "User",
                    NormalizedName = "USER",
                    ConcurrencyStamp = "39972adb-34ed-4c07-967d-9b238e640d87",
                },
            };

            builder.Entity<IdentityRole>().HasData(roles);
        }
    }
}
