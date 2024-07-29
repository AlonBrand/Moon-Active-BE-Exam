import configuration from '../../configurations/configuration.json' assert { type: 'json' };
import { groupRewards } from './groupRewards.js';
import { Reward, MissionsConfig } from '../types/rewardsTypes';


export function calculateRewards(grantedPoints: number, newPoints: number): Record<string, number> {
  if (newPoints === undefined || configuration === undefined) return {};

  const rewards: Reward[] = [];
  const { missions, repeatedIndex } = configuration as MissionsConfig;
  let missionIndex = 0;
  let oldPoints = newPoints - grantedPoints;

  
  while (oldPoints > 0) {
    const currentMission = missions[missionIndex];
    if (currentMission === undefined) break;
    if (oldPoints >= currentMission.pointsGoal) {
      oldPoints -= currentMission.pointsGoal;
      missionIndex++;
      if (missionIndex >= missions.length) {
        missionIndex = repeatedIndex - 1;
      }
    }
    else {
      break;
    }
  }
  
  
  let remainingPoints = grantedPoints + oldPoints; // Whats left from old points counter and the additional grantedPoints

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
  
  return groupRewards(rewards);
}
