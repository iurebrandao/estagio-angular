'use strict';

angular.module('myApp')
    .service('payment', function(config, $window, $http) {

        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + $window.localStorage.getItem("key")
        };

        this.get = function (card_id) {
            return $http({
                method: "GET",
                headers: headers,
                url: config.URL + "cards/" + card_id + "/payments"
            });
        };

        this.post = function (id_cartao, valor) {
            return $http({
                method: "POST",
                url: config.URL + "payments",
                headers: headers,
                data: {
                    "card_id": id_cartao,
                    "amount": valor
                }

            });
        };

        this.delete = function (pay_id) {
            return $http({
                method: "DELETE",
                url: config.URL + "payments/" + pay_id,
                headers: headers,
                data: {
                    "id": pay_id
                }

            });
        };

        this.patch = function (id_pagamento, status_correto) {
            return $http({
                method: "PATCH",
                url: config.URL + "payments/" + id_pagamento,
                headers: headers,
                data: {
                    "id": id_pagamento,
                    "status": status_correto
                }
            });

        };
    });