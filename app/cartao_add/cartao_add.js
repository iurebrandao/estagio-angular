'use strict';

angular.module('myApp.cartao_add', ['ngRoute'])

    .controller('CartaoAddCtrl', ["$scope", "$location", "$http", "config",
        function ($scope, $location, $http, config) {
            var vm = this;

            // Função para resetar os campos do formulário de criacão de um novo cartão
            $scope.resetForm = function() {
                $scope.nome = null;
                $scope.numero = null;
                $scope.bandeira = null;
                $scope.mes = null;
                $scope.ano = null;
                $scope.limite = null;
            };

            // Função que cria um cartão a partir das informações inseridas pelo usuário.
            // Essas informações são armazenadas no "array_info".
            $scope.createCard = function (array_info) {

                console.log(array_info);

                // Faz a requisição "POST" para criar um novo cartão
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

                    // Mensagem adicionada para aparecer na view como retorno para o usuário
                    $scope.msg = "Cartão adicionado com sucesso!";

                    $scope.resetForm();

                }, function (response) {
                    vm.data = response.data || 'Request failed';

                    // Mensagem adicionada para aparecer na view como retorno para o usuário
                    $scope.msg_error = "Erro ao adicionar o cartão";
                });
            };
        }]);