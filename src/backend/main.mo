import Map "mo:core/Map";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Order "mo:core/Order";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
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
    avatar : Text; // New field for emoji avatar
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

  let allowedAvatars : [Text] = ["🐧", "🦄", "🐯", "🦊", "🌈", "🌟"];

  // Helper function to validate avatar
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

  // Required Profile Management Functions
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

  // Legacy function - kept for backward compatibility
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

    // Verify user has a profile
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

        // Initialize impact tracking for this moment
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
      case (null) {
        Runtime.trap("Moment not found");
      };
      case (?moment) {
        // Prevent self-impacting
        if (moment.user == caller) {
          Runtime.trap("Cannot impact your own moment");
        };

        // Check if user already impacted this moment
        switch (momentImpacts.get(momentId)) {
          case (null) {
            Runtime.trap("Moment impact tracking not initialized");
          };
          case (?impactSet) {
            if (impactSet.contains(caller)) {
              Runtime.trap("You have already impacted this moment");
            };

            // Add user to impact set
            impactSet.add(caller);
            momentImpacts.add(momentId, impactSet);

            // Update moment impact count
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

  // Admin function to remove inappropriate moments
  public shared ({ caller }) func removeMoment(momentId : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can remove moments");
    };

    switch (weeklyMoments.get(momentId)) {
      case (null) {
        Runtime.trap("Moment not found");
      };
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
            } else {
              challenge;
            };
          },
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
            } else {
              challenge;
            };
          },
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

  // Global Stats - requires user authentication
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

  // Top Moments - requires user authentication
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
        } else {
          #equal;
        };
      }
    );
  };

  // Admin function to view all user profiles
  public query ({ caller }) func getAllUserProfiles() : async [(Principal, UserProfile)] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    userProfiles.entries().toArray();
  };

  // Admin function to get platform statistics
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
};
