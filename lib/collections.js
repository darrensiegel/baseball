Baseball = {};

Baseball.Teams = new Mongo.Collection("teams");
Baseball.Rosters = new Mongo.Collection("rosters");
Baseball.ActiveGames = new Mongo.Collection("activeGames");
Baseball.BoxScores = new Mongo.Collection("boxScores");
Baseball.ActivePlays = new Mongo.Collection("activePlays");
