'use strict';

var app = angular.module('myApp.transactions', ['ngRoute','firebase', 'ngMaterial'])
    .config(
        ['$routeProvider', function($routeProvider) {
            $routeProvider.when('/transactions', {
                templateUrl: 'transactions.html',
                controller: ['transactionsCtrl']
            })
        }]
    );

app.controller('transactionsCtrl', ['$scope', '$firebaseArray', '$mdSidenav', '$location', function($scope, $firebaseArray, $mdSidenav, $location) {
    var scope = $scope;
    var ref = new Firebase('https://budget-tracker-application.firebaseio.com/transactions');

    $scope.$watch(function (path) {
        $scope.path = path;
    });

    scope.openLeftMenu = function() {
        $mdSidenav('left').toggle();
    };
    scope.openRightMenu = function() {
        $mdSidenav('right').toggle();
    };

    scope.createTransaction = function() {
        scope.newDate = null;
        scope.newAmount = '';
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
        ref.on("child_added", function (snapshot) {
            console.log(snapshot.val());
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
    }}]);

app.directive( 'goClick', function ( $location ) {
    return function ( scope, element, attrs ) {
        var path;

        attrs.$observe( 'goClick', function (val) {
            path = val;
        });

        element.bind( 'click', function () {
            scope.$apply( function () {
                $location.path( path );
            });
        });
    };
});



