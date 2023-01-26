using System;
using System.Security.Claims;
using Finjector.Web.Models;
using Ietws;
using Microsoft.Extensions.Options;

namespace Finjector.Web
{
    public interface IIamIdService
    {
        Task<string?> GetIamId();
    }

    public class IamIdService : IIamIdService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AuthOptions _authOptions;

        public const string IamIdClaimType = "ucdPersonIAMID";

        public IamIdService(IHttpContextAccessor httpContextAccessor, IOptions<AuthOptions> authOptions)
        {
            _httpContextAccessor = httpContextAccessor;
            _authOptions = authOptions.Value;
        }

        public async Task<string?> GetIamId()
        {
            var iamId = _httpContextAccessor.HttpContext?.User.FindFirstValue(IamIdClaimType);

            if (!string.IsNullOrWhiteSpace(iamId))
            {
                return iamId;
            }

            return await GetIamIdFallback();
        }

        private async Task<string?> GetIamIdFallback()
        {
            var kerbId = _httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(kerbId))
            {
                return null;
            }

            var clientws = new IetClient(_authOptions.IamKey);
            var ucdKerbResult = await clientws.Kerberos.Search(KerberosSearchField.userId, kerbId);

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
            return ucdKerbPerson.IamId;
        }
    }
}
