angular.module('financeTrackerApp')
  .controller('DashboardController', ['$scope', '$http', function($scope, $http) {
    $scope.transactions = [];
    $scope.summary = { income: 0, expenses: 0, balance: 0 };
    $scope.error = null;

    $http.get('http://127.0.0.1:5000/api/transactions', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    })
      .then(function(response) {
        $scope.transactions = response.data;
        $scope.summary.income = $scope.transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.amount, 0);
        $scope.summary.expenses = $scope.transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        $scope.summary.balance = $scope.summary.income - $scope.summary.expenses;
      })
      .catch(function(err) {
        $scope.error = 'Failed to load transactions: ' + (err.data?.message || err.statusText);
        console.error('Transactions fetch error:', err);
      });
  }]);