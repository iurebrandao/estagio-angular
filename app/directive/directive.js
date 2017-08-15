'use strict';
angular.module('myApp')
    .directive('error', function() {
        return {
            scope: {
                errors: '='
            },
            templateUrl: 'directive/errors.html'
        };
    });