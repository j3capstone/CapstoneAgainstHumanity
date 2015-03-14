var app = angular.module('capstone');

app.controller('StartController', function($log, $scope, $rootScope, $cookieStore, $location) {
    'use strict';

    var socket = io();

    $scope.user = {};

    $scope.create = function(){
        $rootScope.user = $scope.user;
        $cookieStore.put('user', $scope.user);

        socket.emit('createGame', $scope.user.username);
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
