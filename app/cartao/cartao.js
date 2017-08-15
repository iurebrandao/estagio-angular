'use strict';

angular.module('myApp.cartao', ['ngRoute'])



    .controller('CartaoCtrl', ["$scope","$http", "config", function ($scope, $http, config) {
        var vm = this;

        // Inicializa a variável payments para receber os pagamentos de cada cartão
        $scope.payments={};

        // Função que recupera a lista de cartões existentes e mostra na tabela de cartões na view
        vm.getCards = function () {

            // Cria o elemento "spinner" que indica o carregamento das informações para o usuário
            document.getElementById("loader").style.display = "block";

            // Faz a requisição "Get" para receber a lista de cartões
            $http({
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                url: config.URL + "cards"
            }).then(function (response) {

                // Esconde o elemento "spinner" que indica o carregamento das informações para o usuário
                document.getElementById("loader").style.display = "none";

                // Adiciona as informações de retorno (lista de cartões) da requisição
                // na variável do controler
                vm.data = response.data;

                if(vm.data.length < 1){
                    // Mensagem adicionada para aparecer na view como retorno para o usuário
                    $scope.msg_user = "Não há nenhum cartão registrado em nosso banco de dados!";
                }

            }, function (response) {

                // Esconde o elemento "spinner" que indica o carregamento das informações para o usuário
                document.getElementById("loader").style.display = "none";

                // Adiciona as informações de retorno da requisição na variável do controler
                vm.data = response.data || 'Request failed';

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user_error = "Erro ao carregar a lista de cartões";

                // Chama a função para atualizar a lista de cartões com as novas informações
                vm.getCards();

            });
        };

        // Função que altera as informações de um cartão a partir das informações novas que o
        // usuário quer editar
        vm.editCard = function (id_cartao,nome,numero,bandeira,mes,ano,limite) {

            var mes_exp = parseInt(mes);
            var ano_exp = parseInt(ano);

            // Faz a requisição "PATCH" para editar um cartão
            $http({
                method: "PATCH",
                url: config.URL + "cards/" + id_cartao,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                    "id": id_cartao,
                    "name": nome,
                    "number": numero,
                    "brand": bandeira,
                    "exp_month": mes_exp,
                    "exp_year": ano_exp,
                    "limit": limite
                }
            }).then(function (response) {

                // Adiciona as informações de retorno da requisição na variável do controler
                vm.data = response.data;

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user = "Cartão editado com sucesso!";

                // Chama a função para atualizar a lista de cartões com as novas informações
                vm.getCards();


            }, function (response)  {

                // Adiciona as informações de retorno da requisição na variável do controler
                vm.data = response.data || 'Request failed';

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user_error = "Erro ao editar o cartão";

                // Chama a função para atualizar a lista de cartões com as novas informações
                vm.getCards();

            });
        };

        // Função que deleta um cartão da lista de cartões a partir do "id" desse cartão
        vm.deleteCard = function (id_cartao) {

            // Faz a requisição "DELETE" para deletar um cartão
            $http({
                method: "DELETE",
                url: config.URL + "cards/" + id_cartao,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                    "id": id_cartao
                }
            }).then(function (response) {

                // Chama a função para atualizar a lista de cartões com as novas informações
                vm.getCards();

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user = "Cartão removido com sucesso!";

            }, function (response) {

                // Adiciona as informações de retorno da requisição na variável do controler
                vm.data = response.data || 'Request failed';

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user_error = "Erro ao deletar o cartão";

            });
        };

    }]);
