'use strict';

angular.module('myApp')
    .service('card', function(config, $window, $http) {

        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + $window.localStorage.getItem("key")
        };

        this.get = function () {

            // Faz a requisição "Get" para receber a lista de cartões
            return $http({
                method: "GET",
                headers: headers,
                url: config.URL + "cards"
            });
        };

        this.delete = function(id_cartao){

            return $http({
                method: "DELETE",
                url: config.URL + "cards/" + id_cartao,
                headers: headers,
                data: {
                    "id": id_cartao
                }
            });
        };

        this.post = function (nome,numero,bandeira,mes,ano,limite) {
            return $http({
                method: "POST",
                url: config.URL + "cards",
                headers: headers,
                data: {
                    "name": nome,
                    "number": numero,
                    "brand": bandeira,
                    "exp_month":mes,
                    "exp_year": ano,
                    "limit": limite
                }
            });
        };

        this.getCard = function (id_cartao) {
            return $http({
                method: "GET",
                headers: headers,
                url: config.URL + "cards/" + id_cartao
            });
        };

        this.patch = function (id,nome,numero,bandeira,mes_exp,ano_exp,limite) {
            return $http({
                method: "PATCH",
                url: config.URL + "cards/" + id,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + $window.localStorage.getItem("key")
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
            });
        };
    });