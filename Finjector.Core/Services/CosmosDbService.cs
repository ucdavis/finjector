using System;
using System.Collections.ObjectModel;
using Finjector.Core.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using Serilog;

namespace Finjector.Core.Services;

public interface ICosmosDbService
{
    Task<List<Chart>> GetCharts(string iamId);
    Task<Chart> GetChart(string id, string iamId);
    Task AddOrUpdateChart(Chart chart);
    Task DeleteChart(string id, string iamId);
}

public class CosmosDbService : IDisposable, ICosmosDbService
{
    private readonly Lazy<Task<CosmosClient>> _cosmosClient;
    private readonly CosmosOptions _cosmosOptions;

    public const string ChartContainerName = "charts";


    public CosmosDbService(IOptions<CosmosOptions> cosmosOptions)
    {
        _cosmosOptions = cosmosOptions.Value;
        _cosmosClient = new Lazy<Task<CosmosClient>>(async () =>
        {
            var client = new CosmosClient(_cosmosOptions.Endpoint, _cosmosOptions.Key, new CosmosClientOptions
            {
                // Gateway is necessary for connecting to an Azure Cosmos DB when debugging locally
                // in order to avoid 503 Service Unavailable errors.
                ConnectionMode = _cosmosOptions.UseGateway ? ConnectionMode.Gateway : ConnectionMode.Direct,
                SerializerOptions = new CosmosSerializationOptions
                {
                    PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
                }
            });
            var database = await client.CreateDatabaseIfNotExistsAsync(_cosmosOptions.DatabaseName);
            var containerProperties = new ContainerProperties(id: ChartContainerName, partitionKeyPath: "/iamId");
            containerProperties.IndexingPolicy.IncludedPaths.Add(new IncludedPath { Path = "/*" });
            containerProperties.IndexingPolicy.ExcludedPaths.Add(new ExcludedPath { Path = "/segmentString/*" });
            var container = await database.Database.CreateContainerIfNotExistsAsync(containerProperties);

            return client;
        });
    }

    public async Task<List<Chart>> GetCharts(string iamId)
    {
        var client = await _cosmosClient.Value;
        var container = client.GetContainer(_cosmosOptions.DatabaseName, ChartContainerName);
        var iterator = container.GetItemQueryIterator<Chart>(
            new QueryDefinition("SELECT * FROM charts WHERE charts.iamId = @iamId")
                .WithParameter("@iamId", iamId));

        var charts = await iterator.ToAsyncEnumerable().ToListAsync();
        return charts;
    }

    public async Task<Chart> GetChart(string id, string iamId)
    {
        var client = await _cosmosClient.Value;
        var container = client.GetContainer(_cosmosOptions.DatabaseName, ChartContainerName);
        var partitionKey = new PartitionKey(iamId);
        var response = await container.ReadItemAsync<Chart>(id, partitionKey);

        return response.Resource;
    }

    public async Task AddOrUpdateChart(Chart chart)
    {
        Log.Information("Adding or updating chart {ChartId}", chart.Id);
        var client = await _cosmosClient.Value;
        var container = client.GetContainer(_cosmosOptions.DatabaseName, ChartContainerName);
        var partitionKey = new PartitionKey(chart.IamId);
        var response = await container.UpsertItemAsync(chart, partitionKey);
    }

    public async Task DeleteChart(string id, string iamId)
    {
        Log.Information("Deleting chart {ChartId}", id);
        var client = await _cosmosClient.Value;
        var container = client.GetContainer(_cosmosOptions.DatabaseName, ChartContainerName);
        var partitionKey = new PartitionKey(iamId);
        var response = await container.DeleteItemAsync<Chart>(id, partitionKey);
    }

    public void Dispose()
    {
        if (_cosmosClient.IsValueCreated)
        {
            _cosmosClient.Value.Result.Dispose();
        }
    }

}

