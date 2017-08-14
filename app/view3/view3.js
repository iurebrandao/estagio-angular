'use strict';

angular.module('myApp.view3', ['ngRoute'])

    .controller('View3Ctrl', ["$scope", "$location", "$http", "$routeParams", "config", 
	function ($scope, $location, $http, $routeParams, config) {
        var vm = this;

        // Funcão que recupera os pagamentos de um determinado cartão a partir do "id" dele
        vm.getPayments = function (card_id, msg_user, msg_user_error) {

            // Cria o elemento "spinner" que indica o carregamento das informações para o usuário
            document.getElementById("loader").style.display = "block";

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
                document.getElementById("loader").style.display = "none"

                // Adiciona as informações de pagamento em "payments"
                // para mostrar na tabela de pagamentos na view
                vm.data = response.data;

                if(vm.data.length < 1){
                    // Mensagem adicionada para aparecer na view como retorno para o usuário
                    vm.msg_user = "Não há nenhum pagamento registrado neste cartão";
                }
                else{
                    // Limpa a mensagem aparecida para o usuário
                    vm.msg_user = null;
                }

                if(msg_user){
                	vm.msg_user = msg_user;
                }

                if(msg_user_error){
                	vm.msg_user_error = msg_user_error;
                }

            }, function (response) {

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                vm.msg_user_error = "Erro ao carregar os pagamentos desse cartão";

                // Esconde o elemento "spinner" que indica o carregamento das informações para o usuário
                document.getElementById("loader").style.display = "none"

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
                var msg_user = "Pagamento feito com sucesso!";

                // Apaga o valor do input "valor"
                $scope.valor = null;

                // Chama a função para atualizar a lista de pagamentos com as novas informações
                vm.getPayments($routeParams.cartaoId ,msg_user);

            }, function (response) {

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                var msg_user_error = "Erro ao fazer o pagamento! Valor do pagamento maior que o disponível";

                // Chama a função para atualizar a lista de pagamentos com as novas informações
                vm.getPayments($routeParams.cartaoId,"",msg_user_error);
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
                var msg_user = "Pagamento removido com sucesso!";

                // Chama a função para atualizar a lista de pagamentos com as novas informações
                vm.getPayments($routeParams.cartaoId, msg_user);


            }, function (response) {

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                var msg_user_error = "Erro ao deletar o pagamento";

                // Chama a função para atualizar a lista de pagamentos com as novas informações
                vm.getPayments($routeParams.cartaoId,"", msg_user_error);

            });
        };

        // Função que edita o status de um pagamento a partir do "id". Essas duas informações
        // são recebidas pelo "array_info"
        vm.editPayment = function (array_info) {

        	console.log(array_info);

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

            console.log(status);

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
                var msg_user = "Pagamento editado com sucesso!";

                // Chama a função para atualizar a lista de pagamentos com as novas informações
                vm.getPayments($routeParams.cartaoId, msg_user );


            }, function (response)  {

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                var msg_user_error = "Erro ao editar o pagamento";

                // Chama a função para atualizar a lista de pagamentos com as novas informações
                vm.getPayments($routeParams.cartaoId, "", msg_user_error );

            });
        };

        vm.cartaoId = $routeParams.cartaoId;
        vm.getPayments(vm.cartaoId);


}]);