angular.module('financeTrackerApp')
  .controller('AuthController', ['$scope', '$location', 'AuthService', function($scope, $location, AuthService) {
    $scope.credentials = {};
    $scope.error = null;

    $scope.login = function() {
      AuthService.login($scope.credentials.email, $scope.credentials.password)
        .then(function(response) {
          $location.path('/dashboard');
        })
        .catch(function(err) {
          $scope.error = 'Login failed: ' + (err.data?.message || err.statusText || 'Unknown error');
        });
    };

    $scope.signup = function() {
      // The button is disabled if the form is invalid, but adding this check for extra safety
      if ($scope.signupForm.$invalid) {
        $scope.error = 'Please correct the form errors before submitting.';
        return;
      }

      AuthService.signup(
        $scope.credentials.firstName,
        $scope.credentials.lastName,
        $scope.credentials.email,
        $scope.credentials.password
      )
        .then(function(response) {
          $location.path('/dashboard');
        })
        .catch(function(err) {
          $scope.error = 'Signup failed: ' + (err.data?.message || err.statusText || 'Unknown error');
        });
    };
  }]);