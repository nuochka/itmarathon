Feature: User deletion by admin

  Scenario: Admin deletes a user
    Given I am logged in as an admin
    When I delete a user from the room
    Then the user is removed successfully

  Scenario: Non-admin cannot delete users
    Given I am logged in as a regular user
    Then I should not see any delete buttons
