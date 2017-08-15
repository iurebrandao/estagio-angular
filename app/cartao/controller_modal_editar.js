angular.module('myApp.cartao')
    .controller('ModalEditarCartaoCtrl', function ($scope, $uibModalInstance, $http, config, id_cartao) {
        var vmModal = this;
        $scope.errors = {};

        $http({
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + config.KEY
            },
            url: config.URL + "cards/" + id_cartao
        }).then(function (response) {

            $scope.id = response.data.id;
            $scope.nome = response.data.name;
            $scope.numero = response.data.number;
            $scope.bandeira = response.data.brand;
            $scope.mes = response.data.exp_month;
            $scope.ano = response.data.exp_year;
            $scope.limite = response.data.limit;

        }, function (response) {
        });


        vmModal.close = function () {
            $uibModalInstance.close();
        };

        // Função que altera as informações de um cartão a partir das informações novas que o
        // usuário quer editar
        vmModal.editCard = function (id,nome,numero,bandeira,mes,ano,limite) {
            var mes_exp = parseInt(mes);
            var ano_exp = parseInt(ano);

            // Faz a requisição "PATCH" para editar um cartão
            $http({
                method: "PATCH",
                url: config.URL + "cards/" + id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                    "id": id,
                    "name": nome,
                    "number": numero,
                    "brand": bandeira,
                    "exp_month": mes_exp,
                    "exp_year": ano_exp,
                    "limit": limite
                }
            }).then(function (response) {

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.msg_user = "Cartão editado com sucesso!";
                $uibModalInstance.close();

            }, function (response)  {

                // Mensagem adicionada para aparecer na view como retorno para o usuário
                $scope.errors = [response.data.message];
            });
        };

    });