using Finjector.Core.Domain;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Finjector.Core.Data
{
    public class DbInitializer
    {
        private readonly AppDbContext _dbContext;

        public DbInitializer(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task Initialize()
        {
            await CheckCreateRoles(Role.Codes.Admin);
            await CheckCreateRoles(Role.Codes.Edit);
            await CheckCreateRoles(Role.Codes.View);

            //var user = new User
            //{
            //    Email = "fake@fake.com",
            //    FirstName = "Fake",
            //    LastName = "User",
            //    Iam = "fake",
            //    Kerberos = "fake",
            //    IsActive = true
            //};
            //_dbContext.Users.Add(user);

            await _dbContext.SaveChangesAsync();
        }

        private async Task CheckCreateRoles(string admin)
        {
            if(await _dbContext.Roles.AnyAsync(r => r.Name == admin))
            {
                return;
            }
            _dbContext.Roles.Add(new Role { Name = admin });
        }
    }
}
