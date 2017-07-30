'use strict';

angular.module('myApp.view1', ['ngRoute'])



    .controller('View1Ctrl', ["$scope","$http", "config", function ($scope, $http, config) {
        var vm = this;

        vm.getCards = function (msg) {
            $http({
                method: "GET",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + config.KEY
                },
                url: config.URL + "cards"
            }).then(function (response) {
                vm.data = response.data;

                if(vm.data.length < 1){
                    $scope.msg_user = "Não há nenhum cartão registrado em nosso banco de dados!";
                }

                if(msg){
                    $scope.msg_user = msg;
                }

            }, function (response) {
                vm.data = response.data || 'Request failed';
                $scope.msg_user = "Erro ao carregar a lista de cartões";

            });
        };

        vm.editCard = function (card_id) {
            $http({
                method: "PATCH",
                url: config.URL + "cards/" + card_id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                    "id": card_id,
                    "name": "Marcelo A Silva",
                    "number": "4000000000000259",
                    "brand": "visa",
                    "exp_month": 6,
                    "exp_year": 2021,
                    "limit": 845000,
                    "available_limit": 845000
                }
            }).then(function (response) {
                vm.data = response.data;
                vm.getCards("Cartão editado com sucesso!");

            }, function (response) {
                vm.data = response.data || 'Request failed';
                $scope.msg_user = "Erro ao editar o cartão";

            });
        };

        vm.deleteCard = function (card_id) {
            $http({
                method: "DELETE",
                url: config.URL + "cards/" + card_id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                    "deleted": true,
                    "id": card_id
                }
            }).then(function (response) {
                vm.getCards("Cartão removido com sucesso!");

            }, function (response) {
                vm.data = response.data || 'Request failed';
                $scope.msg_user = "Erro ao deletar o cartão";

            });
        };

    }]);
