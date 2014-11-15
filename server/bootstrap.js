
Meteor.startup(function () {
    // create some sample data
    if (Baseball.Rosters.find().count() === 0) {

        // add roster test data

        var pirates = Baseball.Teams.insert({ name: "Pittsburgh Pirates" });
        var yankees = Baseball.Teams.insert({ name: "New York Yankees" });

        Baseball.Rosters.insert({ team: pirates, firstName: "Bill", lastName: "Virdon", position: "CF", ba: 0.264, obp: 0.326, slg: 0.406});
        Baseball.Rosters.insert({ team: pirates, firstName: "Dick", lastName: "Groat", position: "SS", ba: 0.325, obp: 0.371, slg: 0.394});
        Baseball.Rosters.insert({ team: pirates, firstName: "Bob", lastName: "Skinner", position: "LF", ba: 0.273, obp: 0.340, slg: 0.431});
        Baseball.Rosters.insert({ team: pirates, firstName: "Rocky", lastName: "Nelson", position: "1B", ba: 0.300, obp: 0.382, slg: 0.470});
        Baseball.Rosters.insert({ team: pirates, firstName: "Roberto", lastName: "Clemente", position: "RF", ba: 0.314, obp: 0.357, slg: 0.458});
        Baseball.Rosters.insert({ team: pirates, firstName: "Smoky", lastName: "Burgess", position: "C", ba: 0.294, obp: 0.356, slg: 0.412});
        Baseball.Rosters.insert({ team: pirates, firstName: "Don", lastName: "Hoak", position: "3B", ba: 0.282, obp: 0.366, slg: 0.445});
        Baseball.Rosters.insert({ team: pirates, firstName: "Bill", lastName: "Mazeroski", position: "2B", ba: 0.273, obp: 0.320, slg: 0.392});
        Baseball.Rosters.insert({ team: pirates, firstName: "Vern", lastName: "Law", position: "P", ba: 0.181, obp: 0.196, slg: 0.309});

        Baseball.Rosters.insert({ team: yankees, firstName: "Bobby", lastName: "Richardson", position: "2B", ba: 0.245, obp: 0.298, slg: 0.353});
        Baseball.Rosters.insert({ team: yankees, firstName: "Tony", lastName: "Kubek", position: "SS", ba: 0.273, obp: 0.312, slg: 0.401});
        Baseball.Rosters.insert({ team: yankees, firstName: "Roger", lastName: "Maris", position: "RF", ba: 0.283, obp: 0.371, slg: 0.581});
        Baseball.Rosters.insert({ team: yankees, firstName: "Mickey", lastName: "Mantle", position: "CF", ba: 0.275, obp: 0.399, slg: 0.558});
        Baseball.Rosters.insert({ team: yankees, firstName: "Yogi", lastName: "Berra", position: "LF", ba: 0.276, obp: 0.347, slg: 0.446});
        Baseball.Rosters.insert({ team: yankees, firstName: "Bill", lastName: "Skowron", position: "1B", ba: 0.309, obp: 0.353, slg: 0.528});
        Baseball.Rosters.insert({ team: yankees, firstName: "Johnny", lastName: "Blanchard", position: "C", ba: 0.242, obp: 0.292, slg: 0.414});
        Baseball.Rosters.insert({ team: yankees, firstName: "Clete", lastName: "Boyer", position: "3B", ba: 0.242, obp: 0.285, slg: 0.405});
        Baseball.Rosters.insert({ team: yankees, firstName: "Bob", lastName: "Turley", position: "P", ba: 0.073, obp: 0.105, slg: 0.091});

    }
});
