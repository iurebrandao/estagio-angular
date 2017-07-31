'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .controller('View2Ctrl', ["$scope", "$location", "$http", "config",
        function ($scope, $location, $http, config) {
        var vm = this;

            $scope.resetForm = function() {
                $scope.nome = null;
                $scope.numero = null;
                $scope.bandeira = null;
                $scope.mes = null;
                $scope.ano = null;
                $scope.limite = null;
            };


        $scope.createCard = function (array_info) {
            $http({
                method: "POST",
                url: config.URL + "cards",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                        "name": array_info[0],
                        "number": array_info[1],
                        "brand": array_info[2],
                        "exp_month":array_info[3],
                        "exp_year": array_info[4],
                        "limit": array_info[5],
                }
            }).then(function (response) {
                vm.data = response.data;
                $scope.msg = "Cartão adicionado com sucesso!";
                $scope.resetForm();

            }, function (response) {
                vm.data = response.data || 'Request failed';
                $scope.msg_error = "Erro ao adicionar o cartão";
            });
        };
    }]);
