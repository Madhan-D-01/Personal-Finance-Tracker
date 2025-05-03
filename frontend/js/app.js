angular.module('financeTrackerApp', ['ngRoute', 'angular-jwt'])
      .config(['$routeProvider', '$httpProvider', 'jwtOptionsProvider', function($routeProvider, $httpProvider, jwtOptionsProvider) {
        $routeProvider
          .when('/', { templateUrl: 'views/login.html', controller: 'AuthController' })
          .when('/signup', { templateUrl: 'views/signup.html', controller: 'AuthController' })
          .when('/dashboard', { templateUrl: 'views/dashboard.html', controller: 'DashboardController', authenticated: true })
          .when('/transactions', { templateUrl: 'views/transactions.html', controller: 'TransactionController', authenticated: true })
          .when('/profile', { templateUrl: 'views/profile.html', controller: 'ProfileController', authenticated: true })
          .otherwise({ redirectTo: '/' });

        jwtOptionsProvider.config({
          tokenGetter: function() { return localStorage.getItem('token') || null; },
          whiteListedDomains: ['localhost', '127.0.0.1'],
          unauthenticatedRedirectPath: '/'
        });

        $httpProvider.interceptors.push('jwtInterceptor');
      }])
      .run(['$rootScope', '$location', 'AuthService', function($rootScope, $location, AuthService) {
        $rootScope.isAuthenticated = function() { return AuthService.isAuthenticated(); };
        $rootScope.logout = function() { AuthService.logout(); $location.path('/'); };
        $rootScope.$on('$routeChangeStart', function(event, next) {
          if (next.authenticated && !AuthService.isAuthenticated()) {
            event.preventDefault();
            $location.path('/');
          } else if ($location.path() === '/' && AuthService.isAuthenticated()) {
            $location.path('/dashboard'); // Redirect to dashboard if authenticated
          }
        });
      }])
      .factory('jwtInterceptor', ['$q', '$window', function($q, $window) {
        return {
          request: function(config) { 
            config.headers = config.headers || {};
            var token = $window.localStorage.getItem('token');
            if (token) config.headers.Authorization = 'Bearer ' + token;
            return config;
          },
          responseError: function(rejection) {
            if (rejection.status === 401) {
              $window.localStorage.removeItem('token');
              $window.location.href = '#!/';
            }
            return $q.reject(rejection);
          }
        };
      }]);