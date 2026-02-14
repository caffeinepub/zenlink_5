import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Set "mo:core/Set";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



// Proper migration with import of migration code in with-clause

actor {
  include MixinStorage();

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  public type UserProfile = {
    displayName : Text;
    interests : [Text];
    perspectives : [Text];
    communicationStyle : Text;
    mbtiType : ?Text;
    comfortMode : Bool;
    location : Text;
    avatar : Text;
  };

  public type WeeklyMoment = {
    user : Principal;
    content : Text;
    timestamp : Time.Time;
    impactCount : Nat;
    category : Text;
  };

  public type WeeklyChallenge = {
    id : Nat;
    description : Text;
    isCompleted : Bool;
  };

  public type DailyChallenge = {
    id : Nat;
    description : Text;
    streak : Nat;
  };

  public type GlobalStats = {
    activeUsers : Nat;
    trendingMbtiTypes : [Text];
    emotionalHeatmap : [Text];
  };

  public type ChatMessage = {
    sender : Principal;
    content : Text;
    timestamp : Time.Time;
    perspective : Text;
  };

  public type Conversation = {
    participants : [Principal];
    messages : List.List<ChatMessage>;
    lastActivity : Time.Time;
  };

  public type Connection = {
    id : Text;
    name : Text;
    avatar : Text;
    interests : [Text];
    personalityType : Text;
    isAvailable : Bool;
  };

  let allowedAvatars : [Text] = ["🐧", "🦄", "🐯", "🦊", "🌈", "🌟"];

  func arrayContains(array : [Text], element : Text) : Bool {
    array.foldLeft(
      false,
      func(found, item) {
        if (found) { true } else { item == element };
      },
    );
  };

  func isValidAvatar(avatar : Text) : Bool {
    arrayContains(allowedAvatars, avatar);
  };

  // Persistent State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let weeklyMoments = Map.empty<Nat, WeeklyMoment>();
  let weeklyChallenges = Map.empty<Principal, [WeeklyChallenge]>();
  let dailyChallenges = Map.empty<Principal, [DailyChallenge]>();
  let momentImpacts = Map.empty<Nat, Set.Set<Principal>>();
  var nextMomentId = 0;

  // Chat Feature persistent state
  let globalChatFeed = List.empty<ChatMessage>();
  let conversations = Map.empty<Text, Conversation>();
  let connections = Map.empty<Text, Connection>();
  let perspectiveCounts = Map.empty<Text, Nat>();

  // Sample Connections (default dataset moved here from migration code)
  let sampleConnectionsList = [
    {
      id = "1";
      name = "Erika Musterfrau";
      avatar = "🐧";
      interests = ["Networking", "Mysticism", "World Religions"];
      personalityType = "ENFJ";
      isAvailable = true;
    },
    {
      id = "2";
      name = "Hans Huber";
      avatar = "🦄";
      interests = ["Tech Talks", "World Religions2", "Coding", "Philosophy"];
      personalityType = "INTP";
      isAvailable = false;
    },
    {
      id = "3";
      name = "Julia Drexler";
      avatar = "🐯";
      interests = ["Art", "Specific Podcast", "Books"];
      personalityType = "INFJ";
      isAvailable = true;
    },
    {
      id = "4";
      name = "Sébastien Dubois";
      avatar = "🦊";
      interests = ["Design", "Music", "Travel"];
      personalityType = "ENFP";
      isAvailable = true;
    },
    {
      id = "5";
      name = "Katrin Musterfrau";
      avatar = "🌈";
      interests = ["Health", "Nature", "Mindfulness"];
      personalityType = "ISFP";
      isAvailable = false;
    },
  ];

  // Helper function to populate sample connections if empty
  func populateSampleConnections() : () {
    if (connections.isEmpty()) {
      for (sample in sampleConnectionsList.values()) {
        connections.add(sample.id, sample);
      };
    };
  };

  // Persistent State Methods
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless admin");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    if (not isValidAvatar(profile.avatar)) {
      Runtime.trap("Invalid avatar. Must be one of the allowed options.");
    };

    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createOrUpdateProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage profiles");
    };
    if (not isValidAvatar(profile.avatar)) {
      Runtime.trap("Invalid avatar. Must be one of the allowed options.");
    };
    userProfiles.add(caller, profile);
  };

  // Weekly Moments
  public shared ({ caller }) func submitWeeklyMoment(content : Text, category : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit moments");
    };

    switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("User must complete profile before submitting moments");
      };
      case (?_profile) {
        let moment : WeeklyMoment = {
          user = caller;
          content;
          timestamp = Time.now();
          impactCount = 0;
          category;
        };
        weeklyMoments.add(nextMomentId, moment);
        momentImpacts.add(nextMomentId, Set.empty<Principal>());
        nextMomentId += 1;
      };
    };
  };

  public shared ({ caller }) func incrementImpact(momentId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can impact moments");
    };

    switch (weeklyMoments.get(momentId)) {
      case (null) { Runtime.trap("Moment not found") };
      case (?moment) {
        if (moment.user == caller) {
          Runtime.trap("Cannot impact your own moment");
        };

        switch (momentImpacts.get(momentId)) {
          case (null) { Runtime.trap("Moment impact tracking not initialized") };
          case (?impactSet) {
            if (impactSet.contains(caller)) {
              Runtime.trap("You have already impacted this moment");
            };

            impactSet.add(caller);
            momentImpacts.add(momentId, impactSet);

            let updatedMoment = {
              moment with
              impactCount = moment.impactCount + 1;
            };
            weeklyMoments.add(momentId, updatedMoment);
          };
        };
      };
    };
  };

  public shared ({ caller }) func removeMoment(momentId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove moments");
    };

    switch (weeklyMoments.get(momentId)) {
      case (null) { Runtime.trap("Moment not found") };
      case (?_moment) {
        weeklyMoments.remove(momentId);
        momentImpacts.remove(momentId);
      };
    };
  };

  // Challenges
  public shared ({ caller }) func completeWeeklyChallenge(challengeId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete challenges");
    };

    switch (weeklyChallenges.get(caller)) {
      case (null) { Runtime.trap("No challenges found") };
      case (?challenges) {
        let updatedChallenges = challenges.map(
          func(challenge) {
            if (challenge.id == challengeId) {
              {
                challenge with
                isCompleted = true;
              };
            } else { challenge };
          }
        );
        weeklyChallenges.add(caller, updatedChallenges);
      };
    };
  };

  public shared ({ caller }) func completeDailyChallenge(challengeId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete challenges");
    };

    switch (dailyChallenges.get(caller)) {
      case (null) { Runtime.trap("No challenges found") };
      case (?challenges) {
        let updatedChallenges = challenges.map(
          func(challenge) {
            if (challenge.id == challengeId) {
              {
                challenge with
                streak = challenge.streak + 1;
              };
            } else { challenge };
          }
        );
        dailyChallenges.add(caller, updatedChallenges);
      };
    };
  };

  public query ({ caller }) func getWeeklyChallenges() : async [WeeklyChallenge] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view challenges");
    };

    switch (weeklyChallenges.get(caller)) {
      case (null) { [] };
      case (?challenges) { challenges };
    };
  };

  public query ({ caller }) func getDailyChallenges() : async [DailyChallenge] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view challenges");
    };

    switch (dailyChallenges.get(caller)) {
      case (null) { [] };
      case (?challenges) { challenges };
    };
  };

  public query ({ caller }) func getGlobalStats() : async GlobalStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view global stats");
    };

    {
      activeUsers = userProfiles.size();
      trendingMbtiTypes = ["ENFP", "INFJ", "ENTJ"];
      emotionalHeatmap = ["Calm", "Support", "Growth"];
    };
  };

  public query ({ caller }) func getTopMoments() : async [WeeklyMoment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view moments");
    };

    weeklyMoments.values().toArray().sort(
      func(a, b) {
        if (a.impactCount > b.impactCount) {
          #less;
        } else if (a.impactCount < b.impactCount) {
          #greater;
        } else { #equal };
      }
    );
  };

  public query ({ caller }) func getAllUserProfiles() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    userProfiles.entries().toArray();
  };

  public query ({ caller }) func getAdminStats() : async {
    totalUsers : Nat;
    totalMoments : Nat;
    totalImpacts : Nat;
  } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view admin stats");
    };

    var totalImpacts = 0;
    for (moment in weeklyMoments.values()) {
      totalImpacts += moment.impactCount;
    };

    {
      totalUsers = userProfiles.size();
      totalMoments = weeklyMoments.size();
      totalImpacts;
    };
  };

  // New Chat Feature (Persistent)
  public shared ({ caller }) func postGlobalMessage(content : Text, perspective : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can post messages");
    };

    let message : ChatMessage = {
      sender = caller;
      content;
      timestamp = Time.now();
      perspective;
    };

    globalChatFeed.add(message);
    updatePerspectiveCount(perspective);
  };

  func updatePerspectiveCount(perspective : Text) : () {
    let currentCount = switch (perspectiveCounts.get(perspective)) {
      case (null) { 0 };
      case (?count) { count };
    };
    perspectiveCounts.add(perspective, currentCount + 1);
  };

  public query ({ caller }) func getGlobalChatFeed() : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view chat feed");
    };
    globalChatFeed.toArray();
  };

  // Persistent Direct Messaging with Conversation Threads
  public shared ({ caller }) func sendMessage(receiver : Principal, content : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can send messages");
    };

    let conversationId = generateConversationId(caller, receiver);
    let message : ChatMessage = {
      sender = caller;
      content;
      timestamp = Time.now();
      perspective = "";
    };

    let updatedMessages = switch (conversations.get(conversationId)) {
      case (null) { List.empty<ChatMessage>() };
      case (?existingConv) { existingConv.messages };
    };

    updatedMessages.add(message);

    let conversation : Conversation = {
      participants = [caller, receiver];
      messages = updatedMessages;
      lastActivity = Time.now();
    };

    conversations.add(conversationId, conversation);
  };

  public query ({ caller }) func getConversation(partner : Principal) : async [ChatMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access conversations");
    };

    let conversationId = generateConversationId(caller, partner);
    switch (conversations.get(conversationId)) {
      case (null) { [] };
      case (?conversation) { conversation.messages.toArray() };
    };
  };

  public query ({ caller }) func getAvailableConnections() : async [Connection] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view connections");
    };

    populateSampleConnections();
    connections.values().toArray();
  };

  func generateConversationId(user1 : Principal, user2 : Principal) : Text {
    if (user1.toText() < user2.toText()) {
      user1.toText() # "|" # user2.toText();
    } else { user2.toText() # "|" # user1.toText() };
  };
};

