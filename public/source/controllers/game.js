var app = angular.module('capstone');

app.controller('GameController', function($routeParams, $scope) {
    'use strict';

    $scope.game = {};
    $scope.game.id = $routeParams.id;
});

