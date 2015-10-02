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
    var ref = new Firebase('https://budget-tracker-application.firebaseio.com/transactions');
    $scope.transactions = $firebaseArray(ref);

    // Add new transaction
    $scope.addTransaction = function() {
        $scope.transactions.$add({
            'date': formatDate($scope.newDate),
            'amount': formatCurrency($scope.newAmount),
            'category': formatCategory($scope.newCategory),
            'expense': formatExpense($scope.newExpense)
        });
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



