using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Finjector.Core.Domain;
using Microsoft.EntityFrameworkCore;

namespace Finjector.Core.Data
{
    public sealed class AppDbContextSqlServer : AppDbContext
    {
        public AppDbContextSqlServer(DbContextOptions<AppDbContextSqlServer> options) : base(options)
        {
        }
    }


    public abstract class AppDbContext : DbContext
    {
        protected AppDbContext(DbContextOptions options) : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Coa> Coas { get; set; }
        public virtual DbSet<Folder> Folders { get; set; }
        public virtual DbSet<FolderPermission> FolderPermissions { get; set; }
        public virtual DbSet<History> Histories { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Team> Teams { get; set; }
        public virtual DbSet<TeamPermission> TeamPermissions { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            Coa.OnModelCreating(builder);
            Folder.OnModelCreating(builder);
            FolderPermission.OnModelCreating(builder);
            Team.OnModelCreating(builder);
            TeamPermission.OnModelCreating(builder);
            Role.OnModelCreating(builder);
            User.OnModelCreating(builder);
            History.OnModelCreating(builder);
        }
    }
}
