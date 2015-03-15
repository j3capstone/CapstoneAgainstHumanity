var app =angular.module('capstone', ['ngRoute', 'ngCookies']);

app.config(function ($routeProvider) {
    'use strict';

    $routeProvider
        .when('/', {
            templateUrl: 'source/views/start.html',
            controller: 'StartController'
        })
        .when ('/:id', {
            templateUrl: 'source/views/game.html',
            controller: 'GameController'
        })
        .otherwise('/');
});
