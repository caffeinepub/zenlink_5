import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WeeklyMoment {
    impactCount: bigint;
    content: string;
    user: Principal;
    timestamp: Time;
    category: string;
}
export type Time = bigint;
export interface DailyChallenge {
    id: bigint;
    streak: bigint;
    description: string;
}
export interface WeeklyChallenge {
    id: bigint;
    isCompleted: boolean;
    description: string;
}
export interface GlobalStats {
    activeUsers: bigint;
    trendingMbtiTypes: Array<string>;
    emotionalHeatmap: Array<string>;
}
export interface UserProfile {
    perspectives: Array<string>;
    displayName: string;
    interests: Array<string>;
    mbtiType?: string;
    comfortMode: boolean;
    communicationStyle: string;
    location: string;
    avatar: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeDailyChallenge(challengeId: bigint): Promise<void>;
    completeWeeklyChallenge(challengeId: bigint): Promise<void>;
    createOrUpdateProfile(profile: UserProfile): Promise<void>;
    getAdminStats(): Promise<{
        totalImpacts: bigint;
        totalUsers: bigint;
        totalMoments: bigint;
    }>;
    getAllUserProfiles(): Promise<Array<[Principal, UserProfile]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyChallenges(): Promise<Array<DailyChallenge>>;
    getGlobalStats(): Promise<GlobalStats>;
    getTopMoments(): Promise<Array<WeeklyMoment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeeklyChallenges(): Promise<Array<WeeklyChallenge>>;
    incrementImpact(momentId: bigint): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    removeMoment(momentId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitWeeklyMoment(content: string, category: string): Promise<void>;
}
