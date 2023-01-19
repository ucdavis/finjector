using System;
using System.Collections.ObjectModel;
using Finjector.Core.Models;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;

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


    public CosmosDbService(IOptions<ConnectionStrings> connectionStrings, IOptions<CosmosOptions> cosmosOptions)
    {
        _cosmosOptions = cosmosOptions.Value;
        _cosmosClient = new Lazy<Task<CosmosClient>>(async () =>
        {
            var client = new CosmosClient(connectionStrings.Value.CosmosDbEndpoint);
            var database = await client.CreateDatabaseIfNotExistsAsync(_cosmosOptions.DatabaseName);
            var container = await database.Database.CreateContainerIfNotExistsAsync(ChartContainerName, "/" + nameof(Chart.IamId));

            return client;
        });
    }

    public async Task<List<Chart>> GetCharts(string iamId)
    {
        var client = await _cosmosClient.Value;
        var container = client.GetContainer(_cosmosOptions.DatabaseName, ChartContainerName);
        var iterator = container.GetItemQueryIterator<Chart>(
            new QueryDefinition("SELECT * FROM charts WHERE charts.IamId = @iamId")
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
        var client = await _cosmosClient.Value;
        var container = client.GetContainer(_cosmosOptions.DatabaseName, ChartContainerName);
        var partitionKey = new PartitionKey(chart.IamId);
        var response = await container.UpsertItemAsync(chart, partitionKey);
    }

    public async Task DeleteChart(string id, string iamId)
    {
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
