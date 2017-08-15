'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.cartao',
    'myApp.cartao_add',
    'myApp.pagamento',
    'ui.bootstrap',
    'ui.utils.masks'
])

    .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider
            .when('/cartao', {
                templateUrl: 'cartao/cartao.html',
                controller: 'CartaoCtrl',
                controllerAs: 'vm'
            })
            .when('/cartao_add', {
                templateUrl: 'cartao_add/cartao_add.html',
                controller: 'CartaoAddCtrl',
                controllerAs: 'vm'
            })
            .when('/pagamento/cartaoId/:cartaoId', {
                templateUrl: 'pagamento/pagamento.html',
                controller: 'PagamentoCtrl',
                controllerAs: 'vm'
            });


        $routeProvider.otherwise({redirectTo: '/cartao'});

    }])

    .constant('config', {
        "URL": "http://estagio.zagu.com.br/"
    });