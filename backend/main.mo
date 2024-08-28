import Char "mo:base/Char";
import Hash "mo:base/Hash";
import Nat32 "mo:base/Nat32";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Result "mo:base/Result";
import Order "mo:base/Order";

actor {
  type Race = {
    id: Text;
    startTime: Time.Time;
  };

  type LeaderboardEntry = {
    id: Text;
    time: Nat;
  };

  stable var leaderboard: [LeaderboardEntry] = [];
  let currentRaces = HashMap.HashMap<Text, Race>(10, Text.equal, Text.hash);

  public func startRace() : async Text {
    let raceId = Text.fromChar(Char.fromNat32(Nat32.fromNat(currentRaces.size())));
    let race: Race = {
      id = raceId;
      startTime = Time.now();
    };
    currentRaces.put(raceId, race);
    raceId
  };

  public func endRace(raceId: Text, time: Nat) : async Result.Result<(), Text> {
    switch (currentRaces.get(raceId)) {
      case (null) {
        #err("Race not found")
      };
      case (?race) {
        currentRaces.delete(raceId);
        updateLeaderboard(raceId, time);
        #ok()
      };
    }
  };

  public query func getLeaderboard() : async [LeaderboardEntry] {
    leaderboard
  };

  func updateLeaderboard(raceId: Text, time: Nat) {
    let entry: LeaderboardEntry = { id = raceId; time = time };
    leaderboard := Array.sort(Array.append(leaderboard, [entry]), func(a: LeaderboardEntry, b: LeaderboardEntry) : Order.Order { 
      Nat.compare(a.time, b.time)
    });
    if (Array.size(leaderboard) > 10) {
      leaderboard := Array.subArray(leaderboard, 0, 10);
    };
  };
}
