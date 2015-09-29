'use strict';

angular.module('myApp.transactions', ['ngRoute','firebase'])
    .config(
        ['$routeProvider', function($routeProvider) {
            $routeProvider.when('/transactions', {
                templateUrl: 'transactions.html',
                controller: 'transactionsCtrl'
            })
        }]
    )
    .controller('transactionsCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
        var scope = $scope;
        var ref                         = new Firebase('https://budget-tracker-application.firebaseio.com/transaction');
        var transactions;
        var transaction                 =
            scope.transaction           = {
                'id'                    : null,
                'cashAmount'            : null,
                'category'              : null,
                'entryDate'             : null,
                'isExpense'             : null
        };
        var format                      =
            scope.format                = {
                'formattedCashAmount'   : null,
                'formattedIsExpense'    : null,
                'formattedDate'         : null
        };

        scope.init = function() {
            transaction.id              = 1 + ($firebaseArray(ref).length);
            transaction.cashAmount      = 0.00;
            transaction.category        = 'No category';
            transaction.entryDate       = formattedDate(new Date());
            transaction.isExpense       = true;
        };

        scope.transactions = function() {
            transactions                = $firebaseArray(ref);
        };

        function formattedDate(date) {
            var d = new Date(date || Date.now()),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [year, month, day].join('-');
        };

        scope.formatData = function() {
            var date = transaction.entryDate;
            format.formattedCashAmount  = '€ 0.00';
            format.formattedIsExpense   = 'Expense';
            format.formattedDate        = formattedDate(date);
            format.formattedCashAmount  = '€ ' + transaction.cashAmount;
            if (transaction.isExpense)
                    format.formattedIsExpense
                                        = 'Expense';
            else    format.formattedIsExpense
                                        = 'Income';
        };

        scope.addTransaction = function() {
            transactions = scope.transactions();
            transactions.$add(
                    transaction
            );
            scope.init();
        };

}]);


