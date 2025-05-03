angular.module('financeTrackerApp')
  .service('AuthService', ['$http', '$window', function($http, $window) {
    this.signup = function(firstName, lastName, email, password) {
      return $http.post('http://localhost:5000/api/auth/signup', { firstName, lastName, email, password })
        .then(function(response) {
          $window.localStorage.setItem('token', response.data.token);
          $window.localStorage.setItem('role', response.data.role);
          return response;
        });
    };

    this.login = function(email, password) {
      return $http.post('http://localhost:5000/api/auth/login', { email, password })
        .then(function(response) {
          $window.localStorage.setItem('token', response.data.token);
          $window.localStorage.setItem('role', response.data.role);
          return response;
        });
    };

    this.logout = function() {
      $window.localStorage.removeItem('token');
      $window.localStorage.removeItem('role');
    };

    this.isAuthenticated = function() {
      return !!$window.localStorage.getItem('token');
    };

    this.getRole = function() {
      return $window.localStorage.getItem('role');
    };
  }]);