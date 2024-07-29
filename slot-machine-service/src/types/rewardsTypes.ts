export interface Reward {
    name: string;
    value: number;
}

export interface Mission {
    rewards: Reward[];
    pointsGoal: number;
}

export interface MissionsConfig {
    missions: Mission[];
    repeatedIndex: number;
}