'use strict';

angular.module('myApp.view1', ['ngRoute'])



    .controller('View1Ctrl', ["$http", "config", function ($http, config) {
        var vm = this;

        vm.sendGet = function () {
            $http({
                method: "GET",
                headers: {
                  //headers aqui
                },
                url: config.URL + "cards",
            }).then(function (response) {
                vm.data = response.data;
                vm.dataView = JSON.stringify(vm.data, null, "\t");
            }, function (response) {
                vm.data = response.data || 'Request failed';

            });
        }

    }]);
