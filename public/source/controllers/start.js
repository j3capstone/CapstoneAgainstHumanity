var app = angular.module('capstone');

app.controller('StartController', function($log, $scope, $rootScope, $cookieStore, $location) {
    'use strict';

    var socket = io();

    $scope.player = {};

    $scope.create = function(){
        $rootScope.player = $scope.player;
        $cookieStore.put('player', $scope.player);

        socket.emit('createGame', $scope.player.playerName);
        $log.log("createGame");
    };

    socket.on('gameCreated', function (id) {
        $log.log("game created");
        $log.log('/'+id);
        $location.path('/'+id);
        $scope.$apply();
    });

    socket.on('gameList', function (games) {
        $scope.games = games;
        $scope.$apply();
    });
});
