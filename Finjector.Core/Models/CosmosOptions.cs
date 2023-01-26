using System;
using Microsoft.Azure.Cosmos;

namespace Finjector.Core.Models;

public class CosmosOptions
{
    public string Endpoint { get; set; } = "";
    public string Key { get; set; } = "";
    public string DatabaseName { get; set; } = "";
    public bool UseGateway { get; set; } = false;
}

