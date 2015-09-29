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
        var scope = $scope;
        var ref                         = new Firebase('https://budget-tracker-application.firebaseio.com/transaction');
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
            console.log(allTransactions());
            transaction.id              = 1 + lastEntry();
            transaction.cashAmount      = 0.00;
            transaction.category        = 'No category';
            transaction.entryDate       = formattedDate(new Date());
            transaction.isExpense       = true;
        };

        function allTransactions() {
            var results = [];
            ref.on("value", function(snapshot) {
                console.log(snapshot.val());
                results = add(snapshot.val());
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
            });
            console.log(results);
        };

        function lastEntry() {
            var lastEntry = 0;
            while(allTransactions().nextId()!=null){
                var object = allTransactions().nextId();
                if(object.id.val()>lastEntry)lastEntry = object.id.val();
                console.log(lastEntry);
            }
            return lastEntry;
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
            scope.transactions();
            transactions.$add(transaction);
            scope.init();
        };

}]);


