
Template.main.helpers({
   waiting: function() {
       return Baseball.Utils.currentGame().away.userId === -1;
   },
   joinedGame: function() {
       console.log(Baseball.Utils.currentGame());
       console.log(Meteor.userId());
       return Baseball.Utils.currentGame() !== undefined;
   }
});

Template.plays.helpers({
    plays: function () {
        return Baseball.ActivePlays.find(
            { game: Baseball.Utils.currentGame()._id});
    }
});



Template.gameDetails.helpers({
    game: function () {
        return Baseball.Utils.currentGame();
    },
    awayBox: function() {
        var game = Baseball.Utils.currentGame();
        var awayTeamId = game.away.teamId;
        var teamName = Baseball.Teams.findOne({_id: awayTeamId}).name;
        var roster = Baseball.BoxScores.find({gameId: game._id, teamId: awayTeamId});

        return {
          teamName: teamName,
          box: roster
        };
    },
    homeBox: function() {
        var game = Baseball.Utils.currentGame();
        var teamId = game.home.teamId;
        var teamName = Baseball.Teams.findOne({_id: teamId}).name;
        var roster = Baseball.BoxScores.find({gameId: game._id, teamId: teamId});

        return {
            teamName: teamName,
            box: roster,

        };
    },
    lineScoreInfo: function() {

        var game = Baseball.Utils.currentGame();
        var homeTeam = Baseball.Teams.findOne({_id: game.home.teamId}).name;
        var awayTeam = Baseball.Teams.findOne({_id: game.away.teamId}).name;
        var requiredInnings = Math.max(game.state.inning, 9);

        var inningLabels = [];
        var homeInnings = [];
        var awayInnings = [];

        for (var i = 0; i < requiredInnings; i++) {
            inningLabels.push(i + 1);

            if (i + 1 <= game.state.inning) {
                awayInnings.push(game.away.lineScore[i]);

                if (i >= game.home.lineScore.length) {
                    homeInnings.push("");
                } else {
                    homeInnings.push(game.home.lineScore[i]);
                }
            } else {
                awayInnings.push("");
                homeInnings.push("");
            }

        }

        return {
            game: Baseball.Utils.currentGame(),
            homeTeam: homeTeam,
            awayTeam: awayTeam,
            inningLabels: inningLabels,
            homeInnings: homeInnings,
            awayInnings: awayInnings
        };
    }
});



var findPlayer = function(id) {
    return Baseball.Rosters.findOne(
        {_id: id});
};


Template.summary.helpers({
    game: function () {
        return Baseball.Utils.currentGame();
    },
    away: function() {
        return Baseball.Teams.findOne({_id: Baseball.Utils.currentGame().away.teamId});
    },
    home: function() {
        return Baseball.Teams.findOne({_id: Baseball.Utils.currentGame().home.teamId});
    },
    batter: function() {
        var game = Baseball.Utils.currentGame();
        var batter;
        if (game.state.top) {
            batter = Baseball.BoxScores.find({gameId: game._id, teamId: game.away.teamId}).fetch()[game.away.batterIndex];
        } else {
            batter = Baseball.BoxScores.find({gameId: game._id, teamId: game.home.teamId}).fetch()[game.home.batterIndex];
        }
        var player = Baseball.Rosters.findOne({_id: batter.playerId});
        return player.firstName + " " + player.lastName;
    },
    availableDecisions: function() {
        var game = Baseball.Utils.currentGame(),
            isAwayTeam = game.away.userId === Meteor.userId(),
            decisions,
            decisionGroups = [];

        if ((game.state.top && isAwayTeam) || (!game.state.top && !isAwayTeam)) {
            decisions = Baseball.Decisions.currentOffensive(game.state.runners, game.state.outs);
        } else {
            decisions = Baseball.Decisions.currentDefensive(game.state.runners, game.state.outs);
        }

        for (var key in decisions) {
            var group = decisions[key];
            var decisionGroup = {
              groupName: key,
              decisions: []
            };
            decisionGroups.push(decisionGroup);
            _.each(group, function (decision) {
                decisionGroup.decisions.push(decision);
            });
        }

        return decisionGroups;
    }
});

UI.registerHelper("lastName", function(id) {
    if (id !== -1) {
        var player = findPlayer(id);
        return player.lastName;
    } else {
        return "";
    }

});

UI.registerHelper("formatInning", function(inning) {
    if (inning === 1) {
        return "1st";
    } else if (inning === 2) {
        return "2nd";
    } else if (inning === 3) {
        return "3rd";
    } else {
        return inning + "th";
    }

});


Template.summary.events({
    'click button': function (event, template) {
        event.preventDefault();
        var gameId = Baseball.Utils.currentGame()._id;

        Meteor.call("playerReady", Meteor.userId(), gameId);
    }
});

var play = function(gameType) {
    Meteor.call("joinGame", Meteor.userId(), gameType, function(error, result) {
        if (error) {
            console.log(error);
        }
    });
};

Template.joinGame.events({
    'click .playComputer': function (event) {
        event.preventDefault();
        play("computer");
    },'click .playHuman': function (event) {
        event.preventDefault();
        play("human");
    }
});