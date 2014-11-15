
"use strict";

Meteor.startup(function () {

    var insertInitialBoxScores = function(gameId, teamId) {
        Baseball.Rosters.find({team: teamId}).forEach(function(player) {
            Baseball.BoxScores.insert({ gameId: gameId, teamId: teamId,
                playerId: player._id,
                name: player.lastName, pos: player.position,
                ab: 0, r: 0, h: 0, rbi: 0, dbl: 0, triple: 0, hr: 0
            });
        });

    };

    Meteor.methods({
        playerReady: function(user, gameId, decision) {

            var game = Baseball.ActiveGames.findOne({_id: gameId});
            if (game.away.userId === user) {
                Baseball.ActiveGames.update(game._id, { $set: {"away.waitingForDecision": false}});

            } else if (game.home.userId === user) {
                Baseball.ActiveGames.update(game._id, { $set: {"home.waitingForDecision": false}});
            }

            var game = Baseball.ActiveGames.findOne({_id: gameId});
            if (!game.away.waitingForDecision && !game.home.waitingForDecision) {

                // transition state
                Baseball.GameManager.transition(game);
            }
        },

        joinGame: function(user) {

            var openGame = Baseball.ActiveGames.findOne({ "away.userId": -1});

            if (openGame === undefined || openGame === null) {

                var pirates = Baseball.Teams.findOne({name: "Pittsburgh Pirates"});
                var yankees = Baseball.Teams.findOne({name: "New York Yankees"});

                var gameId = Baseball.ActiveGames.insert({
                    inProgress: true, // Is this game in progress or over?
                    state: {
                        inning: 1,
                        top: true,
                        outs: 0,
                        runners: [-1, -1, -1]
                    },
                    home: {
                        teamId: pirates._id,
                        userId: user,
                        waitingForDecision: true,
                        runs: 0,
                        hits: 0,
                        lob: 0,
                        errors: 0,
                        batterIndex: 0,
                        pitcherId: -1,
                        lineScore: []
                    },
                    away: {
                        teamId: yankees._id,
                        userId: -1,
                        waitingForDecision: true,
                        runs: 0,
                        hits: 0,
                        lob: 0,
                        errors: 0,
                        batterIndex: 0,
                        pitcherId: -1,
                        lineScore: [0]
                    }
                });

                insertInitialBoxScores(gameId, pirates._id);
                insertInitialBoxScores(gameId, yankees._id);

                return gameId;

            } else {
                Baseball.ActiveGames.update(openGame._id, { $set: {"away.userId": user}});
                return openGame._id;
            }


        }
    });
});