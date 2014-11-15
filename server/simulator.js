Baseball.Simulator = (function() {

    var isOut = function(context) {
        var roll = Math.random();
        return roll > context.batter.obp;
    };

    var determineOutType = function() {
        var roll = Math.random();
        if (roll < 0.5) {
            return "flied out";
        } else {
            return "grounded out";
        }
    };

    var isWalk = function(context) {
        var roll = Math.random();
        var normalizedBA = (context.batter.ba / context.batter.obp);

        return roll > normalizedBA;
    };

    var determineHit = function(context, result) {
        var roll = Math.random();
        result.boxScore.h = 1;
        if (roll < 0.66) {
            result.boxScore.single = 1;
            return 1;
        } else if (roll < 0.85) {
            result.boxScore.dbl = 1;
            return 2;
        } else if (roll < 0.96) {
            result.boxScore.hr = 1;
            return 4;
        } else {
            result.boxScore.triple = 1;
            return 3;
        }
    };

    var createDefaultResult = function() {
        return { outs: 0, runs: 0,
            nextRunners: [-1, -1, -1],
            runnersScored: [],
            boxScore: {
                ab: 1,
                r: 0,
                h: 0,
                rbi: 0,
                dbl: 0,
                triple: 0,
                hr: 0
            }};
    };

    var simBasesEmpty = function(context) {

        var result = createDefaultResult();

        if (isOut(context)) {
            result.outs = 1;
            result.nextRunners = context.game.state.runners;
        } else if (isWalk(context)) {
            result.nextRunners[0] = context.batter._id;
            result.walk = true;
            result.boxScore.ab = 0;
        } else {
            var hit = determineHit(context, result);

            if (hit === 1) {
                result.nextRunners[0]  = context.batter._id;
            } else if (hit === 2) {
                result.nextRunners[1]  = context.batter._id;
            } else if (hit === 3) {
                result.nextRunners[2]  = context.batter._id;
            } else {
                result.runs = 1;
                result.runnersScored = [context.batter._id];
                result.boxScore.r = 1;
                result.boxScore.rbi = 1;
            }
        }
        return result;
    };

    var simOnFirst = function(context) {
        var result = createDefaultResult();

        if (isOut(context)) {

            var roll = Math.random();
            if (context.game.state.outs < 2 && roll < 0.05) {
                result.outs = 2;
            } else {
                result.outs = 1;
                result.nextRunners = context.game.state.runners;
            }

        } else if (isWalk(context)) {
            result.nextRunners[1] = context.game.state.runners[0];
            result.nextRunners[0] = context.batter._id;
            result.walk = true;
            result.boxScore.ab = 0;
        } else {
            var hit = determineHit(context, result);
            result.hit = hit;

            if (hit === 1) {
                result.nextRunners[1]  = context.game.state.runners[0];
                result.nextRunners[0]  = context.batter._id;
            } else if (hit === 2) {
                result.nextRunners[2]  = context.game.state.runners[0];
                result.nextRunners[1]  = context.batter._id;
            } else if (hit === 3) {
                result.nextRunners[2]  = context.batter._id;
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[0]];
                result.boxScore.rbi = 1;
            } else {
                result.runs = 2;
                result.runnersScored = [context.batter, context.game.state.runners[0]];
                result.boxScore.rbi = 2;
            }
        }
        return result;
    };

    var simOnSecond = function(context) {
        var result = createDefaultResult();

        if (isOut(context)) {

            var roll = Math.random();
            if (context.game.state.outs < 2 && roll < 0.02) {
                result.outs = 2;
            } else {
                result.outs = 1;
                result.nextRunners = context.game.state.runners;
            }

        } else if (isWalk(context)) {
            result.nextRunners[1] = context.game.state.runners[1];
            result.nextRunners[0] = context.batter._id;
            result.walk = true;
            result.boxScore.ab = 0;
        } else {
            var hit = determineHit(context, result);
            result.hit = hit;

            if (hit === 1) {
                result.nextRunners[2]  = context.game.state.runners[1];
                result.nextRunners[0]  = context.batter._id;
            } else if (hit === 2) {
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[1]];
                result.nextRunners[2]  = context.batter._id;
                result.boxScore.rbi = 1;
            } else if (hit === 3) {
                result.nextRunners[2]  = context.batter._id;
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[1]];
                result.boxScore.rbi = 1;
            } else {
                result.runs = 2;
                result.runnersScored = [context.batter._id, context.game.state.runners[1]];
                result.boxScore.rbi = 2;

            }
        }
        return result;
    };

    var simOnThird = function(context) {
        var result = createDefaultResult();

        if (isOut(context)) {

            var roll = Math.random();
            if (context.game.state.outs < 2 && roll < 0.1) {
                result.outs = 1;
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[2]];
                result.boxScore.rbi = 1;
            } else {
                result.outs = 1;
                result.nextRunners = context.game.state.runners;
            }

        } else if (isWalk(context)) {
            result.nextRunners[2] = context.game.state.runners[2];
            result.nextRunners[0] = context.batter._id;
            result.walk = true;
            result.boxScore.ab = 0;
        } else {
            var hit = determineHit(context, result);
            result.hit = hit;

            if (hit === 1) {
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[2]];
                result.nextRunners[0]  = context.batter._id;
                result.boxScore.rbi = 1;
            } else if (hit === 2) {
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[2]];
                result.nextRunners[2]  = context.batter._id;
                result.boxScore.rbi = 1;
            } else if (hit === 3) {
                result.nextRunners[2]  = context.batter._id;
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[2]];
                result.boxScore.rbi = 1;
            } else {
                result.runs = 2;
                result.runnersScored = [context.batter._id, context.game.state.runners[2]];
                result.boxScore.rbi = 2;
            }
        }
        return result;
    };

    var simOnFirstSecond = function(context) {
        var result = createDefaultResult();

        if (isOut(context)) {

            var roll = Math.random();
            if (context.game.state.outs < 2 && roll < 0.05) {
                result.outs = 2;
                result.nextRunners[2] = context.game.state.runners[1];
            } else if (roll < 0.7) {
                result.outs = 1;
                result.nextRunners = context.game.state.runners;
            } else {
                result.outs = 1;
                result.nextRunners[2] = context.game.state.runners[1];
                result.nextRunners[1] = context.game.state.runners[0];
            }

        } else if (isWalk(context)) {
            result.nextRunners[2] = context.game.state.runners[1];
            result.nextRunners[1] = context.game.state.runners[0];
            result.nextRunners[0] = context.batter._id;
            result.walk = true;
            result.boxScore.ab = 0;
        } else {
            var hit = determineHit(context, result);
            result.hit = hit;

            if (hit === 1) {
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[1]];
                result.nextRunners[2]  = context.game.state.runners[0];
                result.nextRunners[0]  = context.batter._id;
                result.boxScore.rbi = 1;
            } else if (hit === 2) {
                result.runs = 2;
                result.runnersScored = [context.game.state.runners[1], context.game.state.runners[0]];
                result.nextRunners[1]  = context.batter._id;
                result.boxScore.rbi = 2;
            } else if (hit === 3) {
                result.nextRunners[2]  = context.batter._id;
                result.runs = 2;
                result.runnersScored = [context.game.state.runners[1], context.game.state.runners[0]];
                result.boxScore.rbi = 2;
            } else {
                result.runs = 3;
                result.runnersScored = [context.batter._id, context.game.state.runners[1], context.game.state.runners[2]];
                result.boxScore.rbi = 3;
            }
        }
        return result;
    };

    var simOnBasesFull = function(context) {
        var result = createDefaultResult();
        var roll = Math.random();

        if (isOut(context)) {

            if (context.game.state.outs < 2 && roll < 0.25) {
                result.outs = 1;
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[2]];
                result.nextRunners[2] = context.game.state.runners[1];
                result.nextRunners[0] = context.game.state.runners[0];
                result.boxScore.rbi = 1;
            } else if (context.game.state.outs === 0 && roll < 0.1) {
                result.outs = 2;
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[2]];
                result.nextRunners[2] = context.game.state.runners[1];
                result.boxScore.rbi = 1;
            } else {
                result.outs = 1;
                result.nextRunners = context.game.state.runners;
            }

        } else if (isWalk(context)) {
            result.runs = 1;
            result.runnersScored = [context.game.state.runners[2]];
            result.nextRunners[2] = context.game.state.runners[1];
            result.nextRunners[1] = context.game.state.runners[0];
            result.nextRunners[0] = context.batter._id;
            result.walk = true;
            result.boxScore.ab = 0;
            result.boxScore.rbi = 1;
        } else {
            var hit = determineHit(context, result);
            result.hit = hit;

            if (hit === 1) {
                if (context.game.state.outs === 2 && roll < 0.9) {
                    result.runs = 2;
                    result.runnersScored = [context.game.state.runners[2], context.game.state.runners[1]];
                    result.nextRunners[2] = context.game.state.runners[0];
                    result.nextRunners[0] = context.batter._id;
                    result.boxScore.rbi = 2;
                } else {
                    result.runs = 1;
                    result.runnersScored = [context.game.state.runners[2]];
                    result.nextRunners[2] = context.game.state.runners[1];
                    result.nextRunners[1] = context.game.state.runners[0];
                    result.nextRunners[0] = context.batter._id;
                    result.boxScore.rbi = 1;
                }
            } else if (hit === 2) {
                result.runs = 3;
                result.runnersScored = [context.game.state.runners[2], context.game.state.runners[1], context.game.state.runners[0]];
                result.nextRunners[1]  = context.batter._id;
                result.boxScore.rbi = 3;
            } else if (hit === 3) {
                result.runs = 3;
                result.runnersScored = [context.game.state.runners[2], context.game.state.runners[1], context.game.state.runners[0]];
                result.nextRunners[2]  = context.batter._id;
                result.boxScore.rbi = 3;
            } else {
                result.runs = 4;
                result.runnersScored = [context.batter._id, context.game.state.runners[2], context.game.state.runners[1], context.game.state.runners[0]];
                result.boxScore.rbi = 4;
            }
        }
        return result;
    };

    var simOnFirstThird = function(context) {
        var result = createDefaultResult();
        var roll = Math.random();

        if (isOut(context)) {

            if (context.game.state.outs < 2 && roll < 0.25) {
                result.outs = 1;
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[2]];
                result.nextRunners[0] = context.game.state.runners[0];
                result.boxScore.rbi = 1;
            } else {
                result.outs = 1;
                result.nextRunners = context.game.state.runners;
            }

        } else if (isWalk(context)) {
            result.nextRunners[2] = context.game.state.runners[2];
            result.nextRunners[1] = context.game.state.runners[0];
            result.nextRunners[0] = context.batter._id;
            result.walk = true;
            result.boxScore.ab = 0;
        } else {
            var hit = determineHit(context, result);
            result.hit = hit;

            if (hit === 1) {
                if (context.game.state.outs === 2 && roll < 0.9) {
                    result.runs = 1;
                    result.runnersScored = [context.game.state.runners[2]];
                    result.nextRunners[2] = context.game.state.runners[0];
                    result.nextRunners[0] = context.batter._id;
                    result.boxScore.rbi = 1;
                } else {
                    result.runs = 1;
                    result.runnersScored = [context.game.state.runners[2]];
                    result.nextRunners[1] = context.game.state.runners[0];
                    result.nextRunners[0] = context.batter._id;
                    result.boxScore.rbi = 1;
                }
            } else if (hit === 2) {
                result.runs = 2;
                result.runnersScored = [context.game.state.runners[2], context.game.state.runners[0]];
                result.nextRunners[1]  = context.batter._id;
                result.boxScore.rbi = 2;
            } else if (hit === 3) {
                result.runs = 2;
                result.runnersScored = [context.game.state.runners[2], context.game.state.runners[0]];
                result.nextRunners[2]  = context.batter._id;
                result.boxScore.rbi = 2;
            } else {
                result.runs = 3;
                result.runnersScored = [context.batter._id, context.game.state.runners[2], context.game.state.runners[0]];
                result.boxScore.rbi = 3;
            }
        }
        return result;
    };

    var simOnSecondThird = function(context) {
        var result = createDefaultResult();
        var roll = Math.random();

        if (isOut(context)) {

            if (context.game.state.outs < 2 && roll < 0.25) {
                result.outs = 1;
                result.runs = 1;
                result.runnersScored = [context.game.state.runners[2]];
                result.nextRunners[2] = context.game.state.runners[1];
                result.boxScore.rbi = 1;
            } else {
                result.outs = 1;
                result.nextRunners = context.game.state.runners;
            }

        } else if (isWalk(context)) {
            result.nextRunners[2] = context.game.state.runners[2];
            result.nextRunners[1] = context.game.state.runners[1];
            result.nextRunners[0] = context.batter._id;
            result.walk = true;
            result.boxScore.ab = 0;
        } else {
            var hit = determineHit(context, result);
            result.hit = hit;

            if (hit === 1) {
                if (context.game.state.outs === 2 && roll < 0.9) {
                    result.runs = 2;
                    result.runnersScored = [context.game.state.runners[2], context.game.state.runners[1]];
                    result.nextRunners[0] = context.batter._id;
                    result.boxScore.rbi = 1;
                } else {
                    result.runs = 1;
                    result.runnersScored = [context.game.state.runners[2]];
                    result.nextRunners[2] = context.game.state.runners[1];
                    result.nextRunners[0] = context.batter._id;
                    result.boxScore.rbi = 1;
                }
            } else if (hit === 2) {
                result.runs = 2;
                result.runnersScored = [context.game.state.runners[2], context.game.state.runners[1]];
                result.nextRunners[1]  = context.batter._id;
                result.boxScore.rbi = 2;
            } else if (hit === 3) {
                result.runs = 2;
                result.runnersScored = [context.game.state.runners[2], context.game.state.runners[1]];
                result.nextRunners[2]  = context.batter._id;
                result.boxScore.rbi = 2;
            } else {
                result.runs = 3;
                result.runnersScored = [context.batter._id, context.game.state.runners[2], context.game.state.runners[1]];
                result.boxScore.rbi = 3;
            }
        }
        return result;
    };

    return {
        simulate: function(context) {

            var game = context.game;
            var runners = game.state.runners;

            //context.batter = Baseball.Rosters.findOne({ _id: context.game.atBat});

            var result = null;

            Baseball.Utils.visitRunners(runners, {
                onBasesEmpty: function() {
                    result = simBasesEmpty(context);
                },
                onFirst: function() {
                    result = simOnFirst(context);
                },
                onSecond: function() {
                    result = simOnSecond(context);
                },
                onThird: function() {
                    result = simOnThird(context);
                },
                onFirstSecond: function() {
                    result = simOnFirstSecond(context);
                },
                onFirstThird: function() {
                    result = simOnFirstThird(context);
                },
                onBasesFull: function() {
                    result = simOnBasesFull(context);
                },
                onSecondThird: function() {
                    result = simOnSecondThird(context);
                }
            });

            if (result.outs === 1) {
                result.outType = determineOutType();
            }

            return result;
        }
    };

})();