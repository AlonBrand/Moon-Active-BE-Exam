import configuration from '../../configurations/configuration.json' assert { type: 'json' };
import { groupRewards } from './groupRewards.js';

interface Reward {
  name: string;
  value: number;
}

interface Mission {
  rewards: Reward[];
  pointsGoal: number;
}

interface MissionsConfig {
  missions: Mission[];
  repeatedIndex: number;
}

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

export function calculateRewards(grantedPoints: number, newPoints: number): Reward[] {
    if (grantedPoints === undefined || newPoints === undefined || configuration === undefined) return [];
  
    const rewards: Reward[] = [];
    let totalPoints = newPoints;
    const { missions, repeatedIndex } = configuration as MissionsConfig;
    const adjustedRepeatedIndex = repeatedIndex - 1;
  
    // Calculate the rewards based on the new total points:
    let missionIndex = 0;
    while (totalPoints > 0) {
      console.log("🚀 ~ calculateRewards ~ totalPoints:", totalPoints)
      const currentMission = missions[missionIndex];
      console.log("🚀 ~ calculateRewards ~ currentMission power:", currentMission.pointsGoal)
      console.log("🚀 ~ calculateRewards ~ currentMission rewards:", currentMission.rewards)
      if (currentMission !== undefined) {
        if (totalPoints >= currentMission.pointsGoal) {
          rewards.push(...currentMission.rewards);
          totalPoints -= currentMission.pointsGoal;
          missionIndex++;
          if (missionIndex >= missions.length) {
            missionIndex = adjustedRepeatedIndex;
          }
        } else {
          break;
        }
      }
    }
    

    console.log(rewards);
    console.log(groupRewards(rewards));
    return rewards;
}