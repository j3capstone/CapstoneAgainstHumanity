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
        $cookieStore.put('player', $scope.player);

        socket.emit('join', $scope.player.playerName, $routeParams.id);
    };

    $scope.play = function (id) {
        $scope.played = true;
        socket.emit('play', $scope.player.playerName, id);
    };

    $scope.choose = function (id) {
        $scope.chose = true;
        socket.emit('choose', $scope.player.playerName, id);
    };

    socket.on('updatePlayers', function (players) {
        $scope.game.players = players;
        $scope.player = $scope.game.players[$scope.player.playerName]
        $scope.$apply();
    });

    socket.on('cardPlayed', function(){});

    socket.on('cardChosen', function(){});

    socket.on('gameStarted', function(){});

    socket.on('gameEnded', function(){});


    $scope.player = $scope.player || $cookieStore.get('player') || {};

    if ($scope.player.playerName) {
        $scope.join();
    }

});

