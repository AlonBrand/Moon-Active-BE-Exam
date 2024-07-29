import { Reward } from "../types/rewardsTypes";

export function groupRewards(rewards: Reward[]): Record<string, number>  {
    if (rewards === undefined || rewards.length === 0) return {};
    const groupedRewardsObject: { [key: string]: number } = {};

    rewards.forEach((reward) => {
        if (groupedRewardsObject[reward.name] === undefined) {
          groupedRewardsObject[reward.name] = reward.value;
        } else {
          groupedRewardsObject[reward.name] += reward.value;
        }
      });

    return groupedRewardsObject
}