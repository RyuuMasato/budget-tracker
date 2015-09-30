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
        var ref = new Firebase('https://budget-tracker-application.firebaseio.com');
        var transaction = scope.transaction = {date: new Date(), amount: 0, category: '', expense: true};


        scope.init = function() {
            scope.format();
        };

        scope.format = function () {
            if(transaction.category == '')    scope.formatCategory = 'No category...';
            else                                scope.formatCategory = transaction.category;
            scope.formatDate = formatDate(transaction.date);
            scope.formatCash = '€ ' + transaction.amount;
            if (transaction.expense)
                    scope.formatExpense = 'Expense';
            else    scope.formatExpense = 'Income';
        };

        scope.newTransaction = function () {
            // todo: date saves to db as key?
            $firebaseArray(ref).$add(transaction);
        };
        scope.getTransactions = function() {
        ref.on("child_added", function (snapshot, prevChildKey) {
            console.log(snapshot.val());
            //console.log("Date: " + snapshot.val().date);
            //console.log("Amount: " + snapshot.val().amount);
            //console.log("Category: " + snapshot.val().category);
            //console.log("Title: " + snapshot.val().expense);
            //console.log("Previous transaction ID: " + prevChildKey);
        })
        };

        scope.setLastTransaction = function() {
          ref.limitToLast(1).once("child_added", function (snapshot, prevChildKey) {
              var last = snapshot.val();
              console.log(snapshot.val());
              transaction.amount = last.amount;
              transaction.category = last.category;
              transaction.expense = last.expense;
          })
        };

        function formatDate(date) {
            var d = new Date(date || Date.now()),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('/');
        }
    }]);



