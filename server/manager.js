Baseball.GameManager = (function() {

    // What is the context?
    var buildCurrentContext  = function(game) {
        var context = {};
        context.game = game;

        var battingTeam, pitchingTeam, battingOrdinal;
        if (game.state.top) {
            battingTeam = game.away.teamId;
            pitchingTeam = game.home.teamId;
            battingOrdinal = game.away.batterIndex;
        } else {
            battingTeam = game.home.teamId;
            pitchingTeam = game.away.teamId;
            battingOrdinal = game.home.batterIndex;
        }

        var battingRoster = Baseball.Rosters.find({team: battingTeam}).fetch();
        context.batter = battingRoster[battingOrdinal];
        context.batterOrdinal = battingOrdinal;
        context.battingRoster = battingRoster;

        return context;
    };

    var updateGameState = function(context, result) {

        var game = context.game;
        game.state.outs += result.outs;
        game.state.runners = result.nextRunners;

        var battingTeam;
        if (game.state.top) {
            battingTeam = game.away;
        } else {
            battingTeam = game.home;

            // Handle walkoffs
            if (game.state.inning >= 9 && game.home.runs > game.away.runs) {
                game.inProgress = false;
            }
        }

        battingTeam.runs += result.runs;
        if (result.hits > 0) {
            battingTeam.hits++;
        }
        battingTeam.lineScore[battingTeam.lineScore.length - 1] = battingTeam.lineScore[battingTeam.lineScore.length - 1]
                + result.runs;

        battingTeam.batterIndex++;
        if (battingTeam.batterIndex === 9) {
            battingTeam.batterIndex = 0;
        }

        // Handle end of inning transition
        if (game.state.outs === 3) {

            if (game.state.top) {

                if (game.state.inning === 9 && game.home.runs > game.away.runs) {
                    game.inProgress = false;
                }
                game.state.top = false;
                game.home.lineScore.push(0);

            } else {

                if (game.state.inning >= 9 && game.home.runs != game.away.runs) {
                    game.inProgress = false;
                }
                game.away.lineScore.push(0);
                game.state.top = true;
                game.state.inning++;
            }

            game.state.outs = 0;
            game.state.runners = [-1, -1, -1];

        }

        game.away.waitingForDecision = true;
        game.home.waitingForDecision = true;
        var id = game._id;
        delete game._id;

        // Save result of game update
        Baseball.ActiveGames.update(id, { $set: game });

        game._id = id;

        // Update box score for the batter
        Baseball.BoxScores.update({ gameId: id, playerId: context.batter._id}, {
            $inc: {ab: result.boxScore.ab,
                   r: result.boxScore.r,
                   h: result.boxScore.h,
                   rbi: result.boxScore.rbi,
                   dbl: result.boxScore.dbl,
                   triple: result.boxScore.triple,
                   hr: result.boxScore.hr
            }});

        // Update the box score for any other runners that scored
        _.each(result.runnersScored, function(runnerId) {
           if (runnerId !== context.batter._id) {
               Baseball.BoxScores.update({ gameId: id, playerId: runnerId}, {
                   $inc: { r: 1 }});
           }
        });

    };

    var addPlayDescription = function(context, result) {
        // Save score description
        var suffix;
        if (result.outs === 1) {
            suffix = " " + result.outType;
        } else if (result.outs === 2) {
            suffix = " hit into a double play";
        } else if (result.walk) {
            suffix = " walked";
        } else if (result.boxScore.single === 1) {
            suffix = " singled";
        } else if (result.boxScore.dbl === 1) {
            suffix = " doubled";
        } else if (result.boxScore.triple === 1) {
            suffix = " tripled";
        } else if (result.boxScore.hr === 1) {
            suffix = " homered";
        }

        var idToBatter = {};
        for (var i = 0; i < context.battingRoster.length; i++) {
            idToBatter[context.battingRoster[i]._id] = context.battingRoster[i];
        }

        if (result.runs > 0 && (result.boxScore.hr === 0 || result.runs > 1)) {
            suffix = suffix + " and scored "
            for (var i = 0; i < result.runs; i++) {
                if (context.batter._id !== result.runnersScored[i]) {
                    suffix = suffix + idToBatter[result.runnersScored[i]].lastName;
                    if (i < result.runs - 1) {
                        suffix = suffix + ", ";
                    }
                }
            }
        }

        var description = context.batter.firstName + " " + context.batter.lastName + suffix;
        Baseball.ActivePlays.insert({ game: context.game._id, description: description});
        Baseball.ActiveGames.update(context.game._id, {$set: { "state.lastPlay": description}});
    };

    return {
      transition: function(game) {
          var context = buildCurrentContext(game);
          var result = Baseball.Simulator.simulate(context);
          updateGameState(context, result);
          addPlayDescription(context, result);
      }
    };

}());


