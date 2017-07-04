'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .controller('View2Ctrl', ["$http", "config", function ($http, config) {
        var vm = this;

        vm.sendPost = function () {
            $http({
                method: "POST",
                url: config.URL + "cards",
                data: {
                    "card": {
                        "number": "1111 1111 1111 1111",
                        "brand": "visa",
                        "cvv": "777",
                        "expiry_date": "2018-07-03",
                        "limit": "8000",
                        "name": "Murilo Z Marra"
                    }
                }
            }).then(function (response) {
                vm.data = response.data;
                vm.dataView = JSON.stringify(vm.data, null, "\t");
            }, function (response) {
                vm.data = response.data || 'Request failed';

            });
        }
    }]);