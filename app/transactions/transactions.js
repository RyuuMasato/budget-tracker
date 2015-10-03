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

app.controller('transactionsCtrl', ['$scope', '$firebaseArray', '$mdSidenav', '$location', function($scope, $firebaseArray, $mdSidenav) {
    var ref = new Firebase('https://budget-tracker-application.firebaseio.com/transactions').orderByChild('date');
    var transactions = $firebaseArray(ref);
    $scope.transactions = $firebaseArray(ref);
    $scope.allTransactions = true;
    $scope.temporaryTransaction = null;

    // Add new transaction
    $scope.addTransaction = function() {
        transactions.$add({
            'date': formatDate($scope.newDate),
            'amount': formatCurrency($scope.newAmount),
            'category': formatCategory($scope.newCategory),
            'expense': formatExpense($scope.newExpense)
        });
    };
    $scope.resetAddTransaction = function() {
        $scope.newDate = null;
        $scope.newAmount = null;
        $scope.newCategory = null;
        $scope.newExpense = null;
    };

    // test for edits and deleting
    $scope.setTransaction = function(item) {
      //  Y U NO WORK??!!!!
      console.log(transactions.$getRecord(item.$id).category);
        var dinges = transactions.$getRecord(item.$id);

        dinges.category = 'something else';

        transactions.$save(dinges);

        //$scope.newDate = $scope.transaction.date;
        //$scope.newAmount = $scope.transaction.amount;
        //$scope.newCategory =  $scope.transactions.$getRecord(transaction.$id).category;
        //$scope.newExpense = $scope.transaction.expense;
    };
    $scope.updateTransaction = function() {
        transactions.$save({
            'date': formatDate($scope.newDate),
            'amount': formatCurrency($scope.newAmount),
            'category': formatCategory($scope.newCategory),
            'expense': formatExpense($scope.newExpense)
        });
    };
    $scope.deleteTransaction = function(transaction) {
        transactions.$remove($scope.transactions.$getRecord(transaction.$id));
    };

    // Formatting for display and database
    function formatDate(date) {
        if(date == null) return 'no date';
        else {
            var d = new Date(date || Date.now()),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            return [day, month, year].join('/');
        }
    }
    function formatCurrency(amount) {
        if(amount == null || amount == 0) return '€ 0.00';
        else return '€ ' + amount;
    }
    function formatCategory(category) {
        if(category == null) return 'no category';
        else return category;
    }
    function formatExpense(expense) {
        if (expense) return 'Expense';
        else return 'Income';
    }

    // Monitor current URL
    $scope.$watch(function (path) {
        $scope.path = path;
    });

    // Toggle SideNavBars
    $scope.openLeftMenu = function() {
        $mdSidenav('left').toggle();
    };
    $scope.openRightMenu = function() {
        $mdSidenav('right').toggle();
    };

    $scope.showAllTransactions = function() {
        $scope.showTransactions = true;
        $scope.editTransactions = false;
        $scope.newTransactions = false;
    };
    $scope.showEditTransactions = function() {
        $scope.showTransactions = false;
        $scope.editTransactions = true;
        $scope.newTransactions = false;
    };
    $scope.showAllTransactions = function() {
        $scope.showNewTransactions = false;
        $scope.editTransactions = false;
        $scope.newTransactions = true;
    };


    $scope.test = function() {
      console.log($scope.transaction)
    };

}]);

// Directive to change URL via go-click
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



