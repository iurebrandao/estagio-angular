'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .controller('View2Ctrl', ["$http", "config", function ($http, config) {
        var vm = this;

        vm.createCard = function (info) {
            $http({
                method: "POST",
                url: config.URL + "cards",
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + config.KEY
                },
                data: {
                        "number": "1111 1111 1111 1111",
                        "brand": "visa",
                        "exp_year": 2021,
                        "exp_month":6,
                        "limit": "8000",
                        "name": "Murilo Z Marra"
                }
            }).then(function (response) {
                vm.data = response.data;
                vm.dataView = JSON.stringify(vm.data, null, "\t");
            }, function (response) {
                vm.data = response.data || 'Request failed';

            });
        };
    }]);
