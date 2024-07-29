import configuration from '../../configurations/configuration.json' assert { type: 'json' };
import { groupRewards } from './groupRewards.js';
import { Reward, MissionsConfig } from '../types/rewardsTypes';

// export function calculateRewards(grantedPoints: number, newPoints: number): Reward[] {
//   console.log("🚀 ~ calculateRewards ~ grantedPoints:", grantedPoints);
//   console.log("🚀 ~ calculateRewards ~ newPoints:", newPoints);

//   if (grantedPoints === undefined || newPoints === undefined || configuration === undefined) return [];

//   const rewards: Reward[] = [];
//   let prevPoints = newPoints - grantedPoints;
//   const { missions, repeatedIndex } = configuration as MissionsConfig;

//   // Calculate current mission index:
//   let missionIndex = 0;
//   while (prevPoints >= 0) {
//     const currentMission = missions[missionIndex];
//     if (currentMission !== undefined) {
//       prevPoints -= currentMission.pointsGoal;
//       if (prevPoints >= 0) {
//         if (missionIndex < missions.length - 1) missionIndex++;
//         else missionIndex = repeatedIndex;
//       }
//     }
//   }

//   console.log("🚀 ~ calculateRewards ~ missionIndex:", missionIndex);

//   // Gain rewards:
//   while (grantedPoints > 0) {
//     const currentMission = missions[missionIndex];
//     if (currentMission !== undefined) {
//       console.log("🚀 ~ calculateRewards ~ currentMission:", currentMission);
//       console.log("🚀 ~ calculateRewards ~ grantedPoints:", grantedPoints);
//       if (grantedPoints >= currentMission.pointsGoal) {
//         console.log("🚀 ~ calculateRewards ~ grantedPoints:", grantedPoints);
//         rewards.push(...currentMission.rewards);
//         grantedPoints -= currentMission.pointsGoal;
//         if (missionIndex < missions.length - 1) missionIndex++;
//         else missionIndex = repeatedIndex;
//       } else {
//         break;
//       }
//     }
//   }

//   console.log(rewards);
//   return rewards;
// }

export function calculateRewards(newPoints: number): Record<string, number> {
  if (newPoints === undefined || configuration === undefined) return {};

  const rewards: Reward[] = [];
  const { missions, repeatedIndex } = configuration as MissionsConfig;
  let missionIndex = 0;

  while (newPoints > 0) {
    console.log("🚀 ~ calculateRewards ~ newPoints:", newPoints)
    const currentMission = missions[missionIndex];
    if (currentMission !== undefined) {
      if (newPoints >= currentMission.pointsGoal) {
        rewards.push(...currentMission.rewards);
        newPoints -= currentMission.pointsGoal;
        missionIndex++;
        if (missionIndex >= missions.length) {
          missionIndex = repeatedIndex - 1;
        }
      } else {
        break;
      }
    }
  }
    
  return groupRewards(rewards);
}