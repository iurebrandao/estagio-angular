'use strict';

angular.module('myApp.view1', ['ngRoute'])



    .controller('View1Ctrl', ["$scope","$http", "config", function ($scope, $http, config) {
        var vm = this;

        $scope.payments={};

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

        $scope.getPayments = function (card_id) {

            var elements = document.getElementsByClassName("loader-pay");
            for(var i=0;i<elements.length;i++){
                if(elements[i].id === "loader"+card_id){
                    document.getElementById(elements[i].id).style.display = "block";
                }
            }

            $http({
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                url: config.URL + "cards/" + card_id + "/payments"
            }).then(function (response) {

                var elements = document.getElementsByClassName("loader-pay");
                for(var i=0;i<elements.length;i++){
                    if(elements[i].id === "loader"+card_id){
                        document.getElementById(elements[i].id).style.display = "none";
                    }
                }

                $scope.payments[0] = response.data;

                if(response.data.length < 1){
                    $scope.msg_user_pay = "Não há nenhum pagamento registrado neste cartão";
                }
                else{
                    $scope.msg_user_pay = null;
                }

            }, function (response) {
                $scope.msg_user_error_pay = "Erro ao carregar os pagamentos desse cartão";

                var elements = document.getElementsByClassName("loader-pay");
                for(var i=0;i<elements.length;i++){
                    if(elements[i].id === "loader"+card_id){
                        document.getElementById(elements[i].id).style.display = "none";
                    }
                }

            });
        };

        vm.makePayment = function (array_info) {
            $http({
                method: "POST",
                url: config.URL + "payments",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                    "card_id": array_info[0],
                    "amount": array_info[1],
                }
            }).then(function (response) {
                vm.data = response.data;
                $scope.msg_user = "Pagamento feito com sucesso!";
                $scope.valor = null;
                vm.getCards();

            }, function (response) {
                $scope.msg_user_error = "Erro ao fazer o pagamento! Valor do pagamento maior que o disponível";
            });
        };

        vm.deletePayment = function (pay_id) {
            $http({
                method: "DELETE",
                url: config.URL + "payments/" + pay_id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                    "id": pay_id
                }
            }).then(function (response) {
                vm.data = response.data;
                $scope.msg_user = "Pagamento removido com sucesso!";
                vm.getCards();


            }, function (response) {
                vm.getCards();
                $scope.msg_user_error = "Erro ao deletar o pagamento";

            });
        };

        vm.editPayment = function (array_info) {

            var status = '';

            if(array_info[1] === 'Pago'){
                 status = 'paid';
            }
            else if(array_info[1] === 'Pendente'){
                status = 'pending';
            }
            else if(array_info[1] === 'Falhado'){
                status = 'failed';
            }

            $http({
                method: "PATCH",
                url: config.URL + "payments/" + array_info[0],
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                    "id": array_info[0],
                    "status": status
                }
            }).then(function (response) {
                $scope.msg_user = "Pagamento editado com sucesso!";
                vm.getCards();


            }, function (response)  {
                $scope.msg_user_error = "Erro ao editar o pagamento";

            });
        };



    }]);
