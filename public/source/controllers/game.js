var app = angular.module('capstone');

app.controller('GameController', function($log, $routeParams, $scope, $location, $cookieStore) {
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
        if (!$scope.game.inPlay[$scope.player.playerName]) {
            socket.emit('playCard', $scope.player.playerName, id);
        }
    };

    $scope.choose = function (chosenPlayer) {
        $log.log('chose ' + chosenPlayer + '\'s cards.');
        if ($scope.game.cardCzar == $scope.player.playerName) {
            socket.emit('chooseCard', $scope.player.playerName, chosenPlayer);
        }
    };

    socket.on('gameDetails', function (game) {
        $log.log('gameDetails');
        $log.log(game);
        $scope.game = game;
        $scope.$apply();
    });

    socket.on('updateCards', function (inPlay) {
        $log.log('updateCards');
        $log.log(inPlay);
        $scope.game.inPlay = inPlay;
        $scope.$apply();
    });

    socket.on('updatePlayers', function (players) {
        $log.log('updatePlayers');
        $log.log(players);
        $scope.game.players = players;
        $scope.player = $scope.game.players[$scope.player.playerName]
        $scope.$apply();
    });

    socket.on('updateHand', function (hand) {
        $log.log('updateHand');
        $log.log(hand);
        $scope.player.cards = hand;
        $scope.$apply();
    });

    socket.on('roundOver', function (winner, answers) {
        $log.log('roundOver');
        $log.log('The question was "' + $scope.game.questionCard.text + '".');
        $log.log(winner + ' won the round with "' + answers.join(",") + '".');
    });

    socket.on('gameOver', function (winner, answers) {
        $log.log('gameOver');
        $scope.winner = winner;
    });

    $scope.player = $scope.player || $cookieStore.get('player') || {};

    if ($scope.player.playerName) {
        $scope.join();
    }

});

