'use strict';

angular.module('myApp.view1', ['ngRoute'])



    .controller('View1Ctrl', ["$scope","$http", "config", function ($scope, $http, config) {
        var vm = this;

        vm.getCards = function () {

            document.getElementById("loader").style.display = "block";

            $http({
                method: "GET",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + config.KEY
                },
                url: config.URL + "cards"
            }).then(function (response) {
                document.getElementById("loader").style.display = "none";
                vm.data = response.data;

                if(vm.data.length < 1){
                    $scope.msg_user = "Não há nenhum cartão registrado em nosso banco de dados!";
                }

            }, function (response) {
                document.getElementById("loader").style.display = "none";
                vm.data = response.data || 'Request failed';
                $scope.msg_user_error = "Erro ao carregar a lista de cartões";

            });
        };

        vm.editCard = function (array_info) {
            $http({
                method: "PATCH",
                url: config.URL + "cards/" + array_info[0],
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                    "id": array_info[0],
                    "name": array_info[1],
                    "number": array_info[2],
                    "brand": array_info[3],
                    "exp_month": array_info[4],
                    "exp_year": array_info[5],
                    "limit": array_info[6],
                }
            }).then(function (response) {
                vm.data = response.data;
                $scope.msg_user = "Cartão editado com sucesso!";
                vm.getCards();


            }, function (response)  {
                vm.data = response.data || 'Request failed';
                $scope.msg_user_error = "Erro ao editar o cartão";

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
                vm.getCards();
                $scope.msg_user = "Cartão removido com sucesso!";

            }, function (response) {
                vm.data = response.data || 'Request failed';
                $scope.msg_user_error = "Erro ao deletar o cartão";

            });
        };

        vm.getPayments = function (card_id) {
            $http({
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                url: config.URL + "cards/" + card_id + "/payments"
            }).then(function (response) {
                $scope.payments = response.data;

                if(response.data.length < 1){
                    $scope.msg_user_pay = "Não há nenhum pagamento registrado neste cartão";
                }


            }, function (response) {
                $scope.msg_user_error_pay = "Erro ao carregar os pagamentos desse cartão";

            });
        };

    }]);
