import Map "mo:core/Map";
import List "mo:core/List";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  type WeeklyChallenge = {
    id : Nat;
    description : Text;
    isCompleted : Bool;
  };

  type DailyChallenge = {
    id : Nat;
    description : Text;
    streak : Nat;
  };

  type WeeklyMoment = {
    user : Principal;
    content : Text;
    timestamp : Int;
    impactCount : Nat;
    category : Text;
  };

  type Connection = {
    id : Text;
    name : Text;
    avatar : Text;
    interests : [Text];
    personalityType : Text;
    isAvailable : Bool;
  };

  type Conversation = {
    participants : [Principal];
    messages : List.List<{
      sender : Principal;
      content : Text;
      timestamp : Int;
      perspective : Text;
    }>;
    lastActivity : Int;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, {
      displayName : Text;
      interests : [Text];
      perspectives : [Text];
      communicationStyle : Text;
      mbtiType : ?Text;
      comfortMode : Bool;
      location : Text;
      avatar : Text;
    }>;
    weeklyMoments : Map.Map<Nat, WeeklyMoment>;
    weeklyChallenges : Map.Map<Principal, [WeeklyChallenge]>;
    dailyChallenges : Map.Map<Principal, [DailyChallenge]>;
    momentImpacts : Map.Map<Nat, Set.Set<Principal>>;
    userConnections : Map.Map<Principal, Set.Set<Principal>>;
    nextMomentIdStore : Map.Map<Text, Nat>;
    globalChatFeed : List.List<{ sender : Principal; content : Text; timestamp : Int; perspective : Text }>;
    conversations : Map.Map<Text, Conversation>;
    connections : Map.Map<Text, Connection>;
    perspectiveCounts : Map.Map<Text, Nat>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, {
      displayName : Text;
      interests : [Text];
      perspectives : [Text];
      communicationStyle : Text;
      mbtiType : ?Text;
      comfortMode : Bool;
      location : Text;
      avatar : Text;
    }>;
    weeklyMoments : Map.Map<Nat, WeeklyMoment>;
    weeklyChallenges : Map.Map<Principal, [WeeklyChallenge]>;
    dailyChallenges : Map.Map<Principal, [DailyChallenge]>;
    momentImpacts : Map.Map<Nat, Set.Set<Principal>>;
    userConnections : Map.Map<Principal, Set.Set<Principal>>;
    nextMomentIdStore : Map.Map<Text, Nat>;
    globalChatFeed : List.List<{ sender : Principal; content : Text; timestamp : Int; perspective : Text }>;
    conversations : Map.Map<Text, Conversation>;
    connections : Map.Map<Text, Connection>;
    perspectiveCounts : Map.Map<Text, Nat>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
