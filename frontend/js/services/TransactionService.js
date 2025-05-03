angular.module('financeTrackerApp')
  .service('TransactionService', ['$http', function($http) {
    this.getTransactions = function() {
      return $http.get('http://localhost:5000/api/transactions');
    };

    this.addTransaction = function(transaction) {
      return $http.post('http://localhost:5000/api/transactions', transaction);
    };

    this.updateTransaction = function(id, transaction) {
      return $http.put(`http://localhost:5000/api/transactions/${id}`, transaction);
    };

    this.deleteTransaction = function(id) {
      return $http.delete(`http://localhost:5000/api/transactions/${id}`);
    };
  }]);