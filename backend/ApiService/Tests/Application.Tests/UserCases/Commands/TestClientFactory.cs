using Microsoft.AspNetCore.Mvc.Testing;
using System.Net.Http;

namespace Epam.ItMarathon.ApiService.Application.Tests.Helpers
{
    public static class TestClientFactory
    {
        public static HttpClient CreateClient()
        {
            var appFactory = new WebApplicationFactory<Epam.ItMarathon.ApiService.Api.Program>();
            return appFactory.CreateClient();
        }
    }
}
