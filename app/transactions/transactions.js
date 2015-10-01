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
        var ref = new Firebase('https://budget-tracker-application.firebaseio.com/transactions');

        scope.createTransaction = function() {
            scope.newDate = new Date();
            scope.newAmount = 0.00;
            scope.newCategory = '';
            scope.newExpense = true;
        };


        scope.init = function() {
            scope.format();
        };

        scope.format = function(date, amount, category, expense) {
            if(date == null)    scope.dateFormatted = 'no date';
            else                scope.dateFormatted = formatDate(date);

            if(amount == null || amount == 0)
                                scope.amountFormatted = '€ 0.00';
            else                scope.amountFormatted = '€ ' + amount;

            if(category == '')  scope.categoryFormatted = 'no category';
            else                scope.categoryFormatted = category;

            if (expense)        scope.expenseFormatted = 'Expense';
            else                scope.expenseFormatted = 'Income';
        };

        scope.addTransaction = function () {
            $firebaseArray(ref).$add({
                'date': scope.dateFormatted,
                'amount': scope.newAmount,
                'category': scope.categoryFormatted,
                'expense': scope.newExpense});
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
              var snap = snapshot.val();
              console.log(snapshot.val());
              scope.currentDate = snap.date;
              scope.currentAmount = snap.amount;
              scope.currentCategory = snap.category;
              scope.currentExpense = snap.expense;
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



