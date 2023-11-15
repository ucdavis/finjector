using Finjector.Core.Domain;
using Finjector.Web.Models;
using Ietws;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Finjector.Core.Services
{
    public interface IIdentityService
    {
        Task<User?> GetByKerberos(string kerb);
        Task<User?> GetByIam(string iam);
        Task<User?> GetByEmail(string email);
    }

    public class IdentityService : IIdentityService
    {
        private readonly AuthOptions _authOptions;

        public IdentityService(IOptions<AuthOptions> authOptions)
        {
            _authOptions = authOptions.Value;
        }

        public async Task<User?> GetByEmail(string email)
        {
            var clientws = new IetClient(_authOptions.IamKey);
            // get IAM from email
            var iamResult = await clientws.Contacts.Search(ContactSearchField.email, email);
            var iamId = iamResult.ResponseData.Results.Length > 0 ? iamResult.ResponseData.Results[0].IamId : string.Empty;
            if (string.IsNullOrWhiteSpace(iamId))
            {
                return null;
            }
            // return info for the user identified by this IAM 
            var result = await clientws.Kerberos.Search(KerberosSearchField.iamId, iamId);

            if (result.ResponseData.Results.Length > 0)
            {
                var ucdKerbPerson = result.ResponseData.Results.First();
                var user = new User
                {
                    Email = email.ToLower(),
                    FirstName = ucdKerbPerson.FirstName,
                    LastName = ucdKerbPerson.LastName,
                    Kerberos = ucdKerbPerson.UserId,
                    Iam = ucdKerbPerson.IamId
                };
                return user;
            }
            return null;
        }


        public async Task<User?> GetByKerberos(string kerb)
        {
            var clientws = new IetClient(_authOptions.IamKey);
            var ucdKerbResult = await clientws.Kerberos.Search(KerberosSearchField.userId, kerb);

            if (ucdKerbResult.ResponseData.Results.Length == 0)
            {
                return null;
            }

            if (ucdKerbResult.ResponseData.Results.Length != 1)
            {
                var iamIds = ucdKerbResult.ResponseData.Results.Select(a => a.IamId).Distinct().ToArray();
                var userIDs = ucdKerbResult.ResponseData.Results.Select(a => a.UserId).Distinct().ToArray();
                if (iamIds.Length != 1 && userIDs.Length != 1)
                {
                    throw new Exception($"IAM issue with non unique values for kerbs: {string.Join(',', userIDs)} IAM: {string.Join(',', iamIds)}");
                }
            }

            var ucdKerbPerson = ucdKerbResult.ResponseData.Results.First();
            var ucdContactResult = await clientws.Contacts.Get(ucdKerbPerson.IamId);

            var user = new User
            {
                Email = ucdContactResult.ResponseData.Results.First().Email,
                FirstName = ucdKerbPerson.FirstName,
                LastName = ucdKerbPerson.LastName,
                Kerberos = ucdKerbPerson.UserId,
                Iam = ucdKerbPerson.IamId
            };


            return user;
        }

        public async Task<User?> GetByIam(string iam)
        {
            var clientws = new IetClient(_authOptions.IamKey);
            var ucdKerbResult = await clientws.Kerberos.Search(KerberosSearchField.iamId, iam);

            if (ucdKerbResult.ResponseData.Results.Length == 0)
            {
                return null;
            }

            if (ucdKerbResult.ResponseData.Results.Length != 1)
            {
                var iamIds = ucdKerbResult.ResponseData.Results.Select(a => a.IamId).Distinct().ToArray();
                var userIDs = ucdKerbResult.ResponseData.Results.Select(a => a.UserId).Distinct().ToArray();
                if (iamIds.Length != 1 && userIDs.Length != 1)
                {
                    throw new Exception($"IAM issue with non unique values for kerbs: {string.Join(',', userIDs)} IAM: {string.Join(',', iamIds)}");
                }
            }

            var ucdKerbPerson = ucdKerbResult.ResponseData.Results.First();

            var ucdContactResult = await clientws.Contacts.Get(ucdKerbPerson.IamId);

            var user = new User
            {
                Email = ucdContactResult.ResponseData.Results.First().Email,
                FirstName = ucdKerbPerson.FirstName,
                LastName = ucdKerbPerson.LastName,
                Kerberos = ucdKerbPerson.UserId,
                Iam = ucdKerbPerson.IamId
            };


            return user;
        }

    }
}
