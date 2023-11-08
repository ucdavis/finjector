﻿using Finjector.Core.Data;
using Finjector.Core.Domain;
using Finjector.Core.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Finjector.Core.Services
{
    public interface ICheckUser
    {
        Task<User> UpdateUser(User user);
        Task UpdateCharts(User user, List<Chart> charts);
    }

    public class CheckUser : ICheckUser
    {
        private readonly AppDbContext _context;

        public CheckUser(AppDbContext context)
        {
            _context = context;
        }

        public async Task UpdateCharts(User user, List<Chart> charts)
        {
            try
            {
                var teams = await _context.Teams.Where(a => a.Owner.Iam == user.Iam && a.IsPersonal).Include(a => a.Folders).ThenInclude(a => a.Coas).ToListAsync();
                var defaultFolder = teams.SelectMany(a => a.Folders).FirstOrDefault(a => a.Name == "Default" && a.Coas.Count == 0);
                if (charts != null && defaultFolder != null)
                {
                    var charts2 = charts.Where(a => a.IamId == user.Iam);
                    foreach (var chart in charts)
                    {
                        var detail = await _context.CoaDetails.FirstOrDefaultAsync(a => a.Id == chart.SegmentString);
                        if (detail == null)
                        {
                            detail = SplitIntoSegements(chart.SegmentString, chart.ChartType);
                            _context.CoaDetails.Add(detail);
                            await _context.SaveChangesAsync();

                            var coa = new Coa
                            {
                                ChartType = chart.ChartType,
                                Name = chart.DisplayName,
                                SegmentString = chart.SegmentString,
                                FolderId = defaultFolder.Id
                            };


                            coa.Detail = detail;
                            _context.Coas.Add(coa);
                        }
                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                var xxx = ex.Message;
            }
        }

        private CoaDetail SplitIntoSegements(string segmentString, string chartType)
        {
            var rtValue = new CoaDetail()
            {
                Id = segmentString,
                ChartType = chartType
            };
            if (chartType == "PPM")
            {
                var parts = segmentString.Split('-');
                rtValue.Project        = parts[0];
                rtValue.Task           = parts[1];
                rtValue.Department     = parts[2];
                rtValue.NaturalAccount = parts[3];
            }
            if (chartType == "GL")
            {
                var parts = segmentString.Split('-');
                rtValue.Entity         = parts[0];
                rtValue.Fund           = parts[1];
                rtValue.Department     = parts[2];
                rtValue.NaturalAccount = parts[3];
                rtValue.Purpose        = parts[4];
                rtValue.Program        = parts[5];
                rtValue.Project        = parts[6];
                rtValue.Activity       = parts[7];
            }

            return rtValue;
        }

        public async Task<User> UpdateUser(User user)
        {

            var foundUser = _context.Users.FirstOrDefault(u => u.Iam == user.Iam);
            if (foundUser != null)
            {
                var update = false;
                if (foundUser.FirstName != user.FirstName)
                {
                    foundUser.FirstName = user.FirstName;
                    update = true;
                }
                if (foundUser.LastName != user.LastName)
                {
                    foundUser.LastName = user.LastName;
                    update = true;
                }
                if (update)
                {
                    await _context.SaveChangesAsync();
                }
            }
            else
            {
                try
                {
                    var newUser = new User
                    {
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Iam = user.Iam,
                        Kerberos = user.Kerberos
                    };
                    var team = new Team
                    {
                        Name = "Personal",
                        Owner = newUser,
                        IsPersonal = true
                    };
                    team.TeamPermissions.Add(new TeamPermission
                    {
                        Role = await _context.Roles.SingleAsync(r => r.Name == Role.Codes.Admin),
                        User = newUser
                    });
                    team.Folders.Add(new Folder
                    {
                        Name = "Default",
                        Team = team
                    });


                    user.IsActive = true;
                    _context.Users.Add(newUser);
                    _context.Teams.Add(team);
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    var xxx = ex.Message;
                    throw new Exception("Error creating user");
                }


            }

            return user;
        }
    }
}