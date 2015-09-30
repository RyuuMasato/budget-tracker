'use strict';

angular.module('myApp.transactions', ['ngRoute','firebase'])
    .config(
        ['$routeProvider', function($routeProvider) {
            $routeProvider.when('/transactions', {
                templateUrl: 'transactions.html',
                controller: ['transactionsCtrl']
            })
        }]
    )
    .controller('transactionsCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
        // todo: look up: if scope = $scope is bad practise
        var scope = $scope;
        var ref                         = new Firebase('https://budget-tracker-application.firebaseio.com/transaction');
        // todo: normalize class/attributes
        var transaction                 =
            scope.transaction           = {
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
            transaction.cashAmount      = 0.00;
            transaction.category        = 'No category';
            transaction.entryDate       = '';
            transaction.isExpense       = true;
        };

        scope.addTransaction = function() {
            $firebaseArray(ref).$add(transaction);
        //    todo: feedback, error check
        };

        scope.setTransaction = function() {
            var ref = new Firebase('https://budget-tracker-application.firebaseio.com/transaction');
            console.log($firebaseArray(ref));
        //    todo: select single value
        };

        function formattedDate(date) {
            var d = new Date(date || Date.now()),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('/');
        }
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

}]);


