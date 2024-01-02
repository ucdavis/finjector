namespace Finjector.Core.Models;

public class SystemOptions
{
    public string Users { get; set; } = string.Empty;

    public string[] GetUsers
    {
        get
        {
            {
                return Users.Split(',', StringSplitOptions.RemoveEmptyEntries);
            }
        }
    }
}