'use strict';

// Declare app level module which depends on views, and components
var app = angular.module( 'myApp', [
                'ngRoute',
                'myApp.transactions',
                'myApp.version',
                'angular-momentjs',
                'firebase',
                'ngMaterial',
                'ngAnimate'
]);

app.config(function($routeProvider,$momentProvider) {
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
        $routeProvider.otherwise({redirectTo: '/newtransactions'});
        $momentProvider
            .asyncLoading(false)
            .scriptUrl('bower_components/angular-momentjs/angular-momentjs.min.js');
    });