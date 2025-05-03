angular.module('financeTrackerApp')
  .controller('ProfileController', ['$scope', '$http', function($scope, $http) {
    $scope.profile = {};
    $scope.originalProfile = {}; // To store a copy of the original profile data
    $scope.message = null;
    $scope.error = null;
    $scope.isEditing = false; // Flag to toggle editing mode

    // Fetch user profile on page load
    $http.get('http://localhost:5000/api/user/profile', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
      .then(function(response) {
        $scope.profile = response.data;
        // Store a deep copy of the original profile data
        $scope.originalProfile = angular.copy($scope.profile);
      })
      .catch(function(err) {
        $scope.error = 'Failed to load profile: ' + (err.data?.message || err.statusText || 'Unknown error');
      });

    // Start editing mode
    $scope.startEditing = function() {
      $scope.isEditing = true;
      $scope.message = null;
      $scope.error = null;
    };

    // Cancel editing and revert changes
    $scope.cancelEditing = function() {
      $scope.isEditing = false;
      $scope.message = null;
      $scope.error = null;
      // Revert to the original profile data
      $scope.profile = angular.copy($scope.originalProfile);
    };

    // Update profile
    $scope.updateProfile = function() {
      if ($scope.profileForm.$invalid) {
        $scope.error = 'Please correct the form errors before submitting.';
        $scope.message = null;
        return;
      }

      $http.put('http://localhost:5000/api/user/profile', $scope.profile, {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
      })
        .then(function(response) {
          $scope.message = response.data.message;
          $scope.error = null;
          $scope.isEditing = false; // Exit editing mode on success
          // Update the original profile with the new data
          $scope.originalProfile = angular.copy($scope.profile);
        })
        .catch(function(err) {
          $scope.error = err.data?.message || 'Failed to update profile';
        });
    };
  }]);