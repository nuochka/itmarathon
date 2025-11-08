using System.Net;
using Epam.ItMarathon.ApiService.Application.Tests.Helpers;
using FluentAssertions;

namespace Epam.ItMarathon.ApiService.Application.Tests.UserCases.Commands
{
    public class UsersControllerTests
    {
        private readonly HttpClient _client;

        public UsersControllerTests()
        {
            _client = TestClientFactory.CreateClient();
        }

        [Fact(DisplayName = "DELETE /users/{id}?userCode=adminCode should delete user successfully")]
        public async Task DeleteUser_AsAdmin_ShouldReturnOk()
        {
            var userId = 3;
            var adminCode = "ecac79a9d6ad49ec93fa737fc85bb857";

            var response = await _client.DeleteAsync($"/api/users/{userId}?userCode={adminCode}");

            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact(DisplayName = "DELETE /users/{id}?userCode=wrongCode should return Forbidden")]
        public async Task DeleteUser_AsNonAdmin_ShouldReturnForbidden()
        {
            var userId = 3;
            var nonAdminCode = "invalid_code_123";

            var response = await _client.DeleteAsync($"/api/users/{userId}?userCode={nonAdminCode}");

            response.StatusCode.Should().Be(HttpStatusCode.Forbidden);
        }

        [Fact(DisplayName = "DELETE /users/{id}?userCode=adminCode when user not found should return NotFound")]
        public async Task DeleteUser_NotExisting_ShouldReturnNotFound()
        {
            var invalidUserId = 9999;
            var adminCode = "ecac79a9d6ad49ec93fa737fc85bb857";

            var response = await _client.DeleteAsync($"/api/users/{invalidUserId}?userCode={adminCode}");

            response.StatusCode.Should().Be(HttpStatusCode.NotFound);
        }
    }
}
