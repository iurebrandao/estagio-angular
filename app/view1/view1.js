'use strict';

angular.module('myApp.view1', ['ngRoute'])



    .controller('View1Ctrl', ["$scope","$http", "config", function ($scope, $http, config) {
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
        // usuário quer editar, que estão no "array_info"
        vm.editCard = function (array_info) {

            var mes = parseInt(array_info[4]);
            var ano = parseInt(array_info[5]);

            // Faz a requisição "PATCH" para editar um cartão
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
                    "exp_month": mes,
                    "exp_year": ano,
                    "limit": array_info[6]
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
        vm.deleteCard = function (card_id) {

            // Faz a requisição "DELETE" para deletar um cartão
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

        // Funcão que recupera os pagamentos de um determinado cartão a partir do "id" dele
        $scope.getPayments = function (card_id) {

            // Cria o elemento "spinner" que indica o carregamento das informações para o usuário
            var elements = document.getElementsByClassName("loader-pay");
            for(var i=0;i<elements.length;i++){
                if(elements[i].id === "loader"+card_id){
                    document.getElementById(elements[i].id).style.display = "block";
                }
            }

            // Faz a requisição "GET" para receber os pagamentos de um determinado cartão
            $http({
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                url: config.URL + "cards/" + card_id + "/payments"
            }).then(function (response) {

                // Esconde o elemento "spinner" que indica o carregamento das informações para o usuário
                var elements = document.getElementsByClassName("loader-pay");
                for(var i=0;i<elements.length;i++){
                    if(elements[i].id === "loader"+card_id){
                        document.getElementById(elements[i].id).style.display = "none";
                    }
                }

                // Adiciona as informações de pagamento em "payments"
                // para mostrar na tabela de pagamentos na view
                $scope.payments[0] = response.data;

                if(response.data.length < 1){
                    // Mensagem adicionada para aparecer na view como retorno para o usuário
                    $scope.msg_user_pay = "Não há nenhum pagamento registrado neste cartão";
                }
                else{
                    // Limpa a mensagem aparecida para o usuário
                    $scope.msg_user_pay = null;
                }

            }, function (response) {

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user_error_pay = "Erro ao carregar os pagamentos desse cartão";

                // Esconde o elemento "spinner" que indica o carregamento das informações para o usuário
                var elements = document.getElementsByClassName("loader-pay");
                for(var i=0;i<elements.length;i++){
                    if(elements[i].id === "loader"+card_id){
                        document.getElementById(elements[i].id).style.display = "none";
                    }
                }

            });
        };

        // Função que faz o pagamento de um cartão a partir do "id" do cartão e o valor do pagamento
        // contidos na variável "array_info"
        vm.makePayment = function (array_info) {

            // Faz a requisição "POST" para fazer o pagamento de um cartão
            $http({
                method: "POST",
                url: config.URL + "payments",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                    "card_id": array_info[0],
                    "amount": array_info[1]
                }

            }).then(function (response) {

                // Adiciona as informações de retorno da requisição na variável do controler
                vm.data = response.data;

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user = "Pagamento feito com sucesso!";

                // Apaga o valor do input "valor"
                $scope.valor = null;

                // Chama a função para atualizar a lista de cartões com as novas informações
                vm.getCards();

            }, function (response) {

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user_error = "Erro ao fazer o pagamento! Valor do pagamento maior que o disponível";
            });
        };

        // Função que deleta um pagamento a partir do "id" dele
        vm.deletePayment = function (pay_id) {

            // Faz a requisição "DELETE" para deletar um pagamento
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

                // Adiciona as informações de retorno da requisição na variável do controler
                vm.data = response.data;

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user = "Pagamento removido com sucesso!";

                // Chama a função para atualizar a lista de cartões com as novas informações
                vm.getCards();


            }, function (response) {

                // Chama a função para atualizar a lista de cartões com as novas informações
                vm.getCards();

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user_error = "Erro ao deletar o pagamento";

            });
        };

        // Função que edita o status de um pagamento a partir do "id". Essas duas informações
        // são recebidas pelo "array_info"
        vm.editPayment = function (array_info) {

            var status = '';

            // A partir de um item selecionado pelo usuário, é colocado o status correto para fazer
            // a requisição
            if(array_info[1] === 'Pago'){
                status = 'paid';
            }
            else if(array_info[1] === 'Pendente'){
                status = 'pending';
            }
            else if(array_info[1] === 'Falhado'){
                status = 'failed';
            }

            // Faz a requisição "PATCH" para editar o status do pagamento
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

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user = "Pagamento editado com sucesso!";

                // Chama a função para atualizar a lista de cartões com as novas informações
                vm.getCards();


            }, function (response)  {

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user_error = "Erro ao editar o pagamento";

            });
        };



    }]);
