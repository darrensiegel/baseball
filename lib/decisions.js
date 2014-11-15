Baseball.Decisions = (function() {

    var o = {
      bunt: "Bunt",
      sacrificeBunt: "Sacrifice bunt",
      hitAndRun: "Hit and run",
      stealSecond: "Steal second",
      stealThird: "Steal third",
      stealHome: "Steal home",
      doubleSteal: "Double steal",
      tripleSteal: "Triple steal",
      suicideSqueeze: "Suicide squeeze"
    };

    var d = {
      infieldIn: "In",
      infieldDeep: "Deep",
      infieldRegular: "Regular",
      outfieldIn: "In",
      outfieldDeep: "Deep",
      outfieldRegular: "Regular",
      holdRunner: "Hold runner",
      guardLines: "Guard lines",
      intentionalWalk: "Intentional walk",
      hitBatter: "Hit batter"
    };

    var all = {};

    for (var key in o) {
        all[key] = o[key];
    }
    for (key in d) {
        all[key] = d[key];
    }

    var currentDefensive = function(runners, outs) {
        var result = null;
        Baseball.Utils.visitRunners(runners, {
            onBasesEmpty: function() {
                result = {Infield: [d.infieldIn, d.infieldDeep, d.infieldRegular],
                          Outfield: [d.outfieldIn, d.outfieldDeep, d.outfieldRegular],
                          Pitching: [d.intentionalWalk, d.hitBatter]};
            },
            onFirst: function() {
                result = {Infield: [d.infieldIn, d.infieldDeep, d.infieldRegular],
                    Outfield: [d.outfieldIn, d.outfieldDeep, d.outfieldRegular],
                    Pitching: [d.intentionalWalk, d.hitBatter], Firstbaseman: [d.holdRunner]};
            },
            onSecond: function() {
                result = {Infield: [d.infieldIn, d.infieldDeep, d.infieldRegular],
                    Outfield: [d.outfieldIn, d.outfieldDeep, d.outfieldRegular],
                    Pitching: [d.intentionalWalk, d.hitBatter], Corners: [d.guardLines]};
            },
            onThird: function() {
                result = {Infield: [d.infieldIn, d.infieldDeep, d.infieldRegular],
                    Outfield: [d.outfieldIn, d.outfieldDeep, d.outfieldRegular],
                    Pitching: [d.intentionalWalk, d.hitBatter]};
            },
            onFirstSecond: function() {
                result = {Infield: [d.infieldIn, d.infieldDeep, d.infieldRegular],
                    Outfield: [d.outfieldIn, d.outfieldDeep, d.outfieldRegular],
                    Pitching: [d.intentionalWalk, d.hitBatter], Corners: [d.guardLines]};
            },
            onFirstThird: function() {
                result = {Infield: [d.infieldIn, d.infieldDeep, d.infieldRegular],
                    Outfield: [d.outfieldIn, d.outfieldDeep, d.outfieldRegular],
                    Pitching: [d.intentionalWalk, d.hitBatter], Corners: [d.guardLines]};
            },
            onBasesFull: function() {
                result = {Infield: [d.infieldIn, d.infieldDeep, d.infieldRegular],
                    Outfield: [d.outfieldIn, d.outfieldDeep, d.outfieldRegular],
                    Pitching: [d.intentionalWalk, d.hitBatter], Corners: [d.guardLines]};
            },
            onSecondThird: function() {
                result = {Infield: [d.infieldIn, d.infieldDeep, d.infieldRegular],
                    Outfield: [d.outfieldIn, d.outfieldDeep, d.outfieldRegular],
                    Pitching: [d.intentionalWalk, d.hitBatter], Corners: [d.guardLines]};
            }
        });
        return result;
    };

    var currentOffensive = function(runners, outs) {
        var result = null;
        Baseball.Utils.visitRunners(runners, {
            onBasesEmpty: function() {
                result = { Offense: [o.bunt]};
            },
            onFirst: function() {
                result = {Offense: [o.bunt, o.sacrificeBunt, o.hitAndRun, o.stealSecond]};
            },
            onSecond: function() {
                result = {Offense: [o.sacrificeBunt, o.stealThird]};
            },
            onThird: function() {
                result = {Offense: [o.suicideSqueeze, o.stealHome]};
            },
            onFirstSecond: function() {
                result = {Offense: [o.sacrificeBunt, o.doubleSteal, o.stealThird]};
            },
            onFirstThird: function() {
                result = {Offense: [o.sacrificeBunt, o.doubleSteal, o.stealSecond, o.hitAndRun]};
            },
            onBasesFull: function() {
                result = {Offense: [o.suicideSqueeze, o.tripleSteal]};
            },
            onSecondThird: function() {
                result = {Offense: [o.suicideSqueeze, o.doubleSteal]};
            }
        });
        return result;
    };

    return {
        all: all,
        allOffensive: o,
        allDefensive: d,
        currentOffensive: currentOffensive,
        currentDefensive: currentDefensive
    };

})();