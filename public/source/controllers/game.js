var app = angular.module('capstone');

app.controller('GameController', function($routeParams, $scope, $location, $cookieStore) {
    'use strict';

    var socket = io();

    $scope.url = $location.absUrl();
    $scope.game = {};
    $scope.game.id = $routeParams.id;

    $scope.session = {};
    $scope.currentRount = {};
    $scope.newGame = {};

    $scope.join = function () {
        $scope.nameSet = true;
        $cookieStore.put('user', $scope.user);

        socket.emit('join', $scope.user.username, $routeParams.id);
    };

    $scope.play = function (id) {
        $scope.played = true;
        socket.emit('play', $scope.user.username, id);
    };

    $scope.choose = function (id) {
        $scope.chose = true;
        socket.emit('choose', $scope.user.username, id);
    };

    socket.on('cardPlayed', function(){});

    socket.on('cardChosen', function(){});

    socket.on('gameStarted', function(){});

    socket.on('gameEnded', function(){});


    $scope.user = $scope.user || $cookieStore.get('user') || {};

    if ($scope.user.username) {
        $scope.join();
    }

});

