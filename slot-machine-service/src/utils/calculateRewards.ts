import configuration from '../../configurations/configuration.json' assert { type: 'json' };
import { groupRewards } from './groupRewards.js';
import { Reward, MissionsConfig } from '../types/rewardsTypes';

export function calculateRewards(grantedPoints: number, newPoints: number): Record<string, number> {
  if (newPoints === undefined || configuration === undefined) return {};

  const rewards: Reward[] = [];
  const { missions, repeatedIndex } = configuration as MissionsConfig;
  let missionIndex = 0;
  let oldPoints = newPoints - grantedPoints;

  // Find the current mission based on the old points
  while (oldPoints > 0) {
    const currentMission = missions[missionIndex];
    if (currentMission === undefined || oldPoints < currentMission.pointsGoal) break;
    oldPoints -= currentMission.pointsGoal;
    missionIndex++;
    if (missionIndex >= missions.length) {
      missionIndex = repeatedIndex - 1;
    }
  }
  
  // Combine the granted points with what's left from the old points
  let remainingPoints = grantedPoints + oldPoints;

  // Try to win another rewards based on the remainingPoints value
  while (remainingPoints > 0) {
    const currentMission = missions[missionIndex];
    if (currentMission === undefined || remainingPoints < currentMission.pointsGoal) break;
    rewards.push(...currentMission.rewards);
    remainingPoints -= currentMission.pointsGoal;
    missionIndex++;
    if (missionIndex >= missions.length) {
      missionIndex = repeatedIndex - 1;
    }
  }
  
  // "Group" the rewards to reduce the amount of calls to Redis DB
  return groupRewards(rewards);
}
