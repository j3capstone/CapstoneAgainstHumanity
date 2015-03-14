var app =angular.module('capstone', ['ngRoute', 'ngCookies']);

app.config(function ($routeProvider) {
    'use strict';

    $routeProvider
        .when('/', {
            templateUrl: 'source/views/home.html',
            controller: 'HomeController'
        })
        .otherwise('/');
});
