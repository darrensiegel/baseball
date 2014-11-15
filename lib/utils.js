Baseball.Utils = {};

Baseball.Utils.currentGame = function() {
    return Baseball.ActiveGames.findOne(
            {$or: [ {"away.userId": Meteor.userId() }, {"home.userId": Meteor.userId() }] });
};

Baseball.Utils.visitRunners = function(runners, visitor) {
    if (runners[0] === -1 && runners[1] === -1 && runners[2] === -1) {
        visitor.onBasesEmpty();
    } else if (runners[0] !== -1 && runners[1] === -1 && runners[2] === -1) {
        visitor.onFirst();
    } else if (runners[0] === -1 && runners[1] !== -1 && runners[2] === -1) {
        visitor.onSecond();
    } else if (runners[0] === -1 && runners[1] === -1 && runners[2] !== -1) {
        visitor.onThird();
    } else if (runners[0] !== -1 && runners[1] !== -1 && runners[2] === -1) {
        visitor.onFirstSecond();
    } else if (runners[0] !== -1 && runners[1] !== -1 && runners[2] !== -1) {
        visitor.onBasesFull();
    } else if (runners[0] !== -1 && runners[1] === -1 && runners[2] !== -1) {
        visitor.onFirstThird();
    } else if (runners[0] === -1 && runners[1] !== -1 && runners[2] !== -1) {
        visitor.onSecondThird();
    }
};