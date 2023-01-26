using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Finjector.Web.Models;
using Microsoft.Extensions.Options;
using Ietws;

namespace Finjector.Web.Handlers
{
    public class IamIdClaimFallbackTransformer : IClaimsTransformation
    {
        public const string ClaimType = "ucdPersonIAMID";
        private readonly AuthOptions _authOptions;

        public IamIdClaimFallbackTransformer(IOptions<AuthOptions> authOptions)
        {
            _authOptions = authOptions.Value;
        }

        public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
        {
            var iamId = principal.FindFirstValue(ClaimType);
            if (!string.IsNullOrWhiteSpace(iamId))
            {
                return principal;
            }

            // if we don't have an IAM ID, try to get it from kerberos and save it in the claims
            var kerbId = principal.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(kerbId))
            {
                return principal;
            }

            var clientws = new IetClient(_authOptions.IamKey);
            var ucdKerbResult = await clientws.Kerberos.Search(KerberosSearchField.userId, kerbId);

            if (ucdKerbResult.ResponseData.Results.Length == 0)
            {
                return principal;
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
            principal.AddIdentity(new ClaimsIdentity(new[]
            {
                new Claim(ClaimType, ucdKerbPerson.IamId)
            }));

            return principal;
        }
    }
}
