angular.module('financeTrackerApp')
  .controller('TransactionController', ['$scope', 'TransactionService', function($scope, TransactionService) {
    $scope.transactions = [];
    $scope.newTransaction = { type: 'income', category: 'Salary' };
    $scope.filters = { type: '', startDate: '', endDate: '' };
    $scope.categories = ['Salary', 'Freelance', 'Food', 'Utilities', 'Entertainment'];

    $scope.loadTransactions = function() {
      TransactionService.getTransactions()
        .then(function(response) {
          $scope.transactions = response.data;
        });
    };

    $scope.addTransaction = function() {
      $scope.newTransaction.date = new Date();
      TransactionService.addTransaction($scope.newTransaction)
        .then(function() {
          $scope.newTransaction = { type: 'income', category: 'Salary' };
          $scope.loadTransactions();
        });
    };

    $scope.editTransaction = function(transaction) {
      $scope.newTransaction = angular.copy(transaction);
    };

    $scope.updateTransaction = function() {
      TransactionService.updateTransaction($scope.newTransaction._id, $scope.newTransaction)
        .then(function() {
          $scope.newTransaction = { type: 'income', category: 'Salary' };
          $scope.loadTransactions();
        });
    };

    $scope.deleteTransaction = function(id) {
      TransactionService.deleteTransaction(id)
        .then(function() {
          $scope.loadTransactions();
        });
    };

    $scope.filterTransactions = function() {
      TransactionService.getTransactions()
        .then(function(response) {
          let transactions = response.data;
          if ($scope.filters.type) {
            transactions = transactions.filter(t => t.type === $scope.filters.type);
          }
          if ($scope.filters.startDate) {
            transactions = transactions.filter(t => new Date(t.date) >= new Date($scope.filters.startDate));
          }
          if ($scope.filters.endDate) {
            transactions = transactions.filter(t => new Date(t.date) <= new Date($scope.filters.endDate));
          }
          $scope.transactions = transactions;
        });
    };

    $scope.loadTransactions();
  }]);