'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.transactions',
    'myApp.version',
    'angular-momentjs',
    'firebase'
])
    .config(
    function($routeProvider,$momentProvider) {
        $routeProvider.when('/transactions', {
            templateUrl: 'transactions/transactions.html',
            controller: 'transactionsCtrl',
            controllerAs: 'transactions'
        });
        $routeProvider.when('/newtransactions', {
            templateUrl: 'transactions/newtransactions.html',
            controller: 'transactionsCtrl',
            controllerAs: 'transactions'
        });
        $routeProvider.otherwise({redirectTo: '/transactions'});
        $momentProvider
            .asyncLoading(false)
            .scriptUrl('bower_components/angular-momentjs/angular-momentjs.min.js');
    });