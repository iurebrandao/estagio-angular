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
            $scope.createCard = function (nome,numero,bandeira,mes,ano,limite) {

                // Faz a requisição "POST" para criar um novo cartão
                $http({
                    method: "POST",
                    url: config.URL + "cards",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + config.KEY
                    },
                    data: {
                        "name": nome,
                        "number": numero,
                        "brand": bandeira,
                        "exp_month":mes,
                        "exp_year": ano,
                        "limit": limite
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