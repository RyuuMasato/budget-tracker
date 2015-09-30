'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.transactions',
    'myApp.version',
    'angular-momentjs',
    'firebase',
    'ngMaterial',
    'ngAnimate'
]).config(
    function($routeProvider,$momentProvider,$mdThemingProvider) {
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
        $mdThemingProvider.theme('default')
            .primaryPalette('blue', {
                'default': '200',
                'hue-1': '100',
                'hue-2': '600',
                'hue-3': 'A100'
            })
            .accentPalette('green', {
                'default': '200',
                'hue-1': '100',
                'hue-2': '600',
                'hue-3': 'A100'
            })
            .warnPalette('red', {
                'default': '200',
                'hue-1': '100',
                'hue-2': '600',
                'hue-3': 'A100'
        });
    });